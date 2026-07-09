import * as signalR from '@microsoft/signalr'
import Cookie from "js-cookie";
import {store} from "@/store";
import {setNotifyList, setOrderNumber} from "@/store/modules/menu.ts";

class Socket {
  private connection: signalR.HubConnection | null = null
  private retryCount = 0;
  private MAX_RETRY = 6;

  connect(){
    const token = Cookie.get('token')
    if (
      this.connection &&
      (
        this.connection.state === signalR.HubConnectionState.Connected ||
        this.connection.state === signalR.HubConnectionState.Connecting ||
        this.connection.state === signalR.HubConnectionState.Reconnecting
      )
    ) {
      console.log('⚡ SignalR is currently connecting, ignore connect.')
      return
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_GROUP_SOCKET_API,{
        skipNegotiation:true,
        transport:signalR.HttpTransportType.WebSockets,
        withCredentials: false,
        accessTokenFactory: () => token || '',
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: () => {
          this.retryCount++;
          console.log(`SignalR reconnection ${this.retryCount} times`);
          return this.retryCount > this.MAX_RETRY ? null : 30000;
        }
      })
      .build();

    this.connection.start()
      .then(() => {
        console.log('SignalR connection successful')
        this.retryCount = 0;

        console.log('retryCount',this.retryCount)

        // connection?.on('OnNoticeMessage', (data) => {
        //     console.log('收到消息:', data)
        // });
        this.connection?.off('OnBroadcastMessage');
        this.connection?.on('OnBroadcastMessage', (data) => {
          // console.log('收到消息:', data)
          const { broadcastId , broadcastType, messageBody, properties } = data

          if(['OnOrderStatusChanged','OnRefundStatusChanged','OnChangeStatusChanged','OnOrderCreated','OnRefundCreated','OnChangeCreated','OnAppendStatusChanged','OnAppendCreated'].includes(broadcastType)){
            const typeMap: Record<string, 'order' | 'refund' | 'change' | 'auxiliary'> = {
              OnOrderStatusChanged: 'order',
              OnRefundStatusChanged: 'refund',
              OnChangeStatusChanged: 'change',
              OnAppendStatusChanged: 'auxiliary',
              OnOrderCreated: 'order',
              OnRefundCreated: 'refund',
              OnChangeCreated: 'change',
              OnAppendCreated: 'auxiliary',
            }

            const changeType = typeMap[broadcastType]

            if (!changeType) return

            if (broadcastType.endsWith('StatusChanged')) {
              const fromStatus = properties.FromStatus
              const ToStatus = properties.ToStatus

              store.dispatch(setOrderNumber({
                type:changeType,
                from: fromStatus.charAt(0).toLowerCase() + fromStatus.slice(1),
                to: ToStatus.charAt(0).toLowerCase() + ToStatus.slice(1),
              }))
            } else if (broadcastType.endsWith('Created')) {
              store.dispatch(setOrderNumber({
                type:changeType,
                from: null,
                to: 'created',
              }))
            }
          }else if(broadcastType === 'OnBalanceChanged'){
            // agent
            // self.postMessage({
            //   type: 'changeAgentBalance',
            //   payload: {
            //     CurrentBalance: properties.CurrentBalance
            //   }
            // })
          } else {
            const typeMap = {
              OnAppendAgentPayment: 'agentPayment',
              OnRejectAgentPayment: 'agentPayment',
              OnReviewedAgentPayment: 'agentPayment',
              OnConfirmAgentPayment: 'agentPayment',

              OnIssuedTicket: 'order',
              OnRejectTicket: 'order',
              OnRefundTicket: 'order',
              OnRejectRefund: 'order',
              OnChangeTicket: 'order',
              OnRejectChange: 'order',
              OnIssuedAmount: 'order',
              OnRejectAmount: 'order',
              OnNotifyEvents: 'order',
              OnAppendTicket: 'order',
              OnRejectAppend: 'order',

              OnChannelLessBalance: 'channel',
              OnChannelPaymentLimited: 'channelPayment',
              OnChannelAccountLimited: 'channelAccount',

              OnAgentQueryLimited: 'agent',
              OnAgentLessBalance: 'agent',
            } as const

            const type = typeMap[broadcastType as keyof typeof typeMap]

            if (!type) return

            store.dispatch(
              setNotifyList({
                broadcastId,
                messageBody,
                properties,
                type,
                time: Date.now(),
              })
            )
          }
        })
      })
      .catch(err => {
        console.error('SignalR connection failed:', err, 'retry:', this.retryCount);
        this.retryCount++;
        if (this.retryCount <= this.MAX_RETRY) {
          setTimeout(() => this.connection?.start(), 30000);
        }
      })
  }
  close(){
    if (
      this.connection &&
      this.connection.state !== signalR.HubConnectionState.Disconnected
    ) {
      this.retryCount = this.MAX_RETRY;
      this.connection.stop();
      this.connection=null
    }
  }
}

export const socketService = new Socket()
