import {Button, Card, Divider, SearchBar, Space, Tag} from "antd-mobile";
import CardText from "@/component/card/cardText.tsx";

const list = [
  {
    "id": "CA-YYZSQFJM-2488",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-FUFBWIDZ-9115",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-J4-V1",
    "groupCode": "INITIAL",
    "accountName": "[J4]Apiushine",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 7,
    "remarks": "**[Query exceeded limited! Current[-16003][-16000]]***",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "陈娜",
    "updatedTime": "2026-04-24T08:34:34.7001957+08:00",
    "createdTime": "2026-03-06T10:18:25.4413172+08:00",
    "expandSettings": [],
    "paymentSettings": [
      {
        "channelAccountId": "CA-YYZSQFJM-2488",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-MIVUKALR-3465",
          "branchId": "B-FUFBWIDZ-9115",
          "isEnabled": true,
          "accountName": "[J4]",
          "accountType": "payment",
          "remarks": null,
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "孙泽升",
          "updatedTime": "2026-03-06T10:19:39.9601391+08:00",
          "createdTime": "2026-03-06T10:19:39.9601409+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-MIVUKALR-3465",
        "operator": "孙泽升",
        "time": "2026-03-06T10:19:51.9063669+08:00"
      }
    ]
  },
  {
    "id": "CA-UAKK7RZZ-3455",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-FUFBWIDZ-9115",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-K9-V1",
    "groupCode": "INITIAL",
    "accountName": "ORIENTAL",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 7,
    "remarks": "**[Query exceeded limited! Current[-16002][-16000]]***",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "陈娜",
    "updatedTime": "2026-04-27T09:45:30.5528307+08:00",
    "createdTime": "2026-03-04T10:41:52.201012+08:00",
    "expandSettings": [
      {
        "indexId": "CA-UAKK7RZZ-3455",
        "value": "ORIENTAL",
        "name": "UserName"
      },
      {
        "indexId": "CA-UAKK7RZZ-3455",
        "value": "4010025723",
        "name": "ApiKey"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-UAKK7RZZ-3455",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-7XWMRCYU-4240",
          "branchId": "B-FUFBWIDZ-9115",
          "isEnabled": true,
          "accountName": "[K9]PayAccount",
          "accountType": "payment",
          "remarks": null,
          "contactName": "cheng/franco ",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "孙泽升",
          "updatedTime": "2026-03-04T10:44:04.3517671+08:00",
          "createdTime": "2026-03-04T10:44:04.3517682+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-7XWMRCYU-4240",
        "operator": "孙泽升",
        "time": "2026-03-04T10:44:43.0463425+08:00"
      }
    ]
  },
  {
    "id": "CA-W0JALKD1-9052",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-FUFBWIDZ-9115",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-FS-V1",
    "groupCode": "INITIAL",
    "accountName": "ORIENTAL_SKY",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 7,
    "remarks": "**[Query exceeded limited! Current[-16001][-16000]]***",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "孙泽升",
    "updatedTime": "2026-04-08T17:26:05.2216525+08:00",
    "createdTime": "2026-02-24T16:54:39.5296158+08:00",
    "expandSettings": [
      {
        "indexId": "CA-W0JALKD1-9052",
        "value": "4000009045",
        "name": "ApiKey"
      },
      {
        "indexId": "CA-W0JALKD1-9052",
        "value": "ORIENTAL_SKY",
        "name": "UserName"
      }
    ],
    "paymentSettings": []
  },
  {
    "id": "CA-02KBDFTM-9643",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-Z5OWWPC2-6899",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-K9-V1",
    "groupCode": "INITIAL",
    "accountName": "ORIENTAL",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 7,
    "remarks": "**[Query exceeded limited! Current[-16006][-16000]]***",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "孙泽升",
    "updatedTime": "2026-04-15T09:57:29.9305136+08:00",
    "createdTime": "2026-02-11T15:39:48.1077903+08:00",
    "expandSettings": [
      {
        "indexId": "CA-02KBDFTM-9643",
        "value": "4010025723",
        "name": "ApiKey"
      },
      {
        "indexId": "CA-02KBDFTM-9643",
        "value": "ORIENTAL",
        "name": "UserName"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-02KBDFTM-9643",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-LJO9XSKJ-3464",
          "branchId": "B-Z5OWWPC2-6899",
          "isEnabled": true,
          "accountName": "[K9]PayAccount",
          "accountType": "payment",
          "remarks": null,
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "孙泽升",
          "updatedTime": "2026-03-04T10:22:12.2184352+08:00",
          "createdTime": "2026-02-11T15:40:47.2926565+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-LJO9XSKJ-3464",
        "operator": "孙泽升",
        "time": "2026-02-11T15:40:55.3094464+08:00"
      }
    ]
  },
  {
    "id": "CA-1U1ZWPPC-5224",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-Z5OWWPC2-6899",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-FS-V1",
    "groupCode": "INITIAL",
    "accountName": "ORIENTAL_SKY",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 7,
    "remarks": "**[Query exceeded limited! Current[-16001][-16000]]***",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "孙泽升",
    "updatedTime": "2026-04-08T17:26:08.7682389+08:00",
    "createdTime": "2026-01-27T17:55:25.4939654+08:00",
    "expandSettings": [
      {
        "indexId": "CA-1U1ZWPPC-5224",
        "value": "4000009045",
        "name": "ApiKey"
      },
      {
        "indexId": "CA-1U1ZWPPC-5224",
        "value": "ORIENTAL_SKY",
        "name": "UserName"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-1U1ZWPPC-5224",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-ZUU9IWRF-8321",
          "branchId": "B-Z5OWWPC2-6899",
          "isEnabled": true,
          "accountName": "[FS]PayAccount",
          "accountType": "payment",
          "remarks": null,
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "孙泽升",
          "updatedTime": "2026-01-27T17:56:22.5093773+08:00",
          "createdTime": "2026-01-27T17:56:22.5093783+08:00",
          "expandSettings": [
            {
              "indexId": "PA-ZUU9IWRF-8321",
              "value": "4000009045",
              "name": "ApiKey"
            }
          ],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-ZUU9IWRF-8321",
        "operator": "孙泽升",
        "time": "2026-01-27T21:00:34.0987282+08:00"
      }
    ]
  },
  {
    "id": "CA-QOGCKGTL-3303",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-FUFBWIDZ-9115",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-SM-V1",
    "groupCode": "INITIAL",
    "accountName": "[SM]Apiushine",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 7,
    "remarks": null,
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "孙泽升",
    "updatedTime": "2026-01-14T14:54:13.8087043+08:00",
    "createdTime": "2026-01-14T14:54:13.8087062+08:00",
    "expandSettings": [
      {
        "indexId": "CA-QOGCKGTL-3303",
        "value": "2bdff48b882d469d435238a0fd6ecb12",
        "name": "ApiKey"
      },
      {
        "indexId": "CA-QOGCKGTL-3303",
        "value": "ORIENTAL SKY",
        "name": "AgentName"
      },
      {
        "indexId": "CA-QOGCKGTL-3303",
        "value": "13677",
        "name": "AgentId"
      },
      {
        "indexId": "CA-QOGCKGTL-3303",
        "value": "AGG",
        "name": "AgentCode"
      },
      {
        "indexId": "CA-QOGCKGTL-3303",
        "value": "13677-2035",
        "name": "AirlineId"
      },
      {
        "indexId": "CA-QOGCKGTL-3303",
        "value": "99329053",
        "name": "SequenceNo"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-QOGCKGTL-3303",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-CAGLT3NI-1685",
          "branchId": "B-FUFBWIDZ-9115",
          "isEnabled": true,
          "accountName": "[SM]PayAccount",
          "accountType": "payment",
          "remarks": null,
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "孙泽升",
          "updatedTime": "2026-01-14T15:16:47.5003585+08:00",
          "createdTime": "2026-01-14T15:16:16.5345326+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-CAGLT3NI-1685",
        "operator": "孙泽升",
        "time": "2026-01-14T15:17:43.6084193+08:00"
      }
    ]
  },
  {
    "id": "CA-JXS7RLK0-4173",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-Z5OWWPC2-6899",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-SM-V1",
    "groupCode": "INITIAL",
    "accountName": "[SM]Apiushine",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 7,
    "remarks": "**[Query exceeded limited! Current[-16030][-16000]]***",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "陈娜",
    "updatedTime": "2026-04-26T15:46:58.4035511+08:00",
    "createdTime": "2026-01-14T14:41:50.4588197+08:00",
    "expandSettings": [
      {
        "indexId": "CA-JXS7RLK0-4173",
        "value": "2bdff48b882d469d435238a0fd6ecb12",
        "name": "ApiKey"
      },
      {
        "indexId": "CA-JXS7RLK0-4173",
        "value": "ORIENTAL SKY",
        "name": "AgentName"
      },
      {
        "indexId": "CA-JXS7RLK0-4173",
        "value": "13677",
        "name": "AgentId"
      },
      {
        "indexId": "CA-JXS7RLK0-4173",
        "value": "AGG",
        "name": "AgentCode"
      },
      {
        "indexId": "CA-JXS7RLK0-4173",
        "value": "13677-2035",
        "name": "AirlineId"
      },
      {
        "indexId": "CA-JXS7RLK0-4173",
        "value": "99329053",
        "name": "SequenceNo"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-JXS7RLK0-4173",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-G2ZQTSUM-8386",
          "branchId": "B-Z5OWWPC2-6899",
          "isEnabled": true,
          "accountName": "[SM]PayAccount",
          "accountType": "payment",
          "remarks": null,
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "孙泽升",
          "updatedTime": "2026-01-14T15:16:57.7114982+08:00",
          "createdTime": "2026-01-14T15:15:26.4387064+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-G2ZQTSUM-8386",
        "operator": "孙泽升",
        "time": "2026-01-14T15:17:50.6895026+08:00"
      }
    ]
  },
  {
    "id": "CA-PDXMTGFV-4963",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-FUFBWIDZ-9115",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-RQ-V1",
    "groupCode": "INITIAL",
    "accountName": "[RQ]Apiushine",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 2,
    "remarks": "**[Query exceeded limited! Current[-16001][-16000]]***",
    "contactName": "cheng/franco",
    "phoneNumber": "86/150017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "陈娜",
    "updatedTime": "2026-04-26T07:16:16.0343395+08:00",
    "createdTime": "2026-01-12T10:46:37.4363641+08:00",
    "expandSettings": [
      {
        "indexId": "CA-PDXMTGFV-4963",
        "value": "USHINE_AVIATION",
        "name": "UserName"
      },
      {
        "indexId": "CA-PDXMTGFV-4963",
        "value": "4000007847",
        "name": "ApiKey"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-PDXMTGFV-4963",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-2KRW8N46-7695",
          "branchId": "B-FUFBWIDZ-9115",
          "isEnabled": true,
          "accountName": "[RQ]PayAccount",
          "accountType": "payment",
          "remarks": null,
          "contactName": "cheng/franco",
          "phoneNumber": "86/150017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "孙泽升",
          "updatedTime": "2026-01-12T10:57:34.7548047+08:00",
          "createdTime": "2026-01-12T10:55:18.1654078+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-2KRW8N46-7695",
        "operator": "孙泽升",
        "time": "2026-01-12T10:56:59.9174707+08:00"
      }
    ]
  },
  {
    "id": "CA-TIVTZBFC-5959",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-Z5OWWPC2-6899",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-RQ-V1",
    "groupCode": "INITIAL",
    "accountName": "[RQ]Apiushine",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 2,
    "remarks": "**[Query exceeded limited! Current[-64038][-16000]]***",
    "contactName": "cheng/franco",
    "phoneNumber": "86/150017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "孙泽升",
    "updatedTime": "2026-03-28T00:14:58.4296547+08:00",
    "createdTime": "2026-01-12T10:45:55.6047078+08:00",
    "expandSettings": [
      {
        "indexId": "CA-TIVTZBFC-5959",
        "value": "4000007847",
        "name": "ApiKey"
      },
      {
        "indexId": "CA-TIVTZBFC-5959",
        "value": "USHINE_AVIATION",
        "name": "UserName"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-TIVTZBFC-5959",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-VHCBC70O-1742",
          "branchId": "B-Z5OWWPC2-6899",
          "isEnabled": true,
          "accountName": "[RQ]PayAccount",
          "accountType": "payment",
          "remarks": null,
          "contactName": "cheng/franco",
          "phoneNumber": "86/150017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "孙泽升",
          "updatedTime": "2026-01-12T10:57:39.088819+08:00",
          "createdTime": "2026-01-12T10:54:38.5527633+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-VHCBC70O-1742",
        "operator": "胡俊",
        "time": "2026-01-12T11:18:40.4914433+08:00"
      }
    ]
  },
  {
    "id": "CA-8GUUYSSY-8085",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-Z5OWWPC2-6899",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-J4-V1",
    "groupCode": "INITIAL",
    "accountName": "[J4]Apiushine",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 7,
    "remarks": "**[Query exceeded limited! Current[-16001][-16000]]***",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "孙泽升",
    "updatedTime": "2026-03-13T09:23:19.0297174+08:00",
    "createdTime": "2025-12-17T14:46:01.7067533+08:00",
    "expandSettings": [],
    "paymentSettings": [
      {
        "channelAccountId": "CA-8GUUYSSY-8085",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-QPM5T0QX-4578",
          "branchId": "B-Z5OWWPC2-6899",
          "isEnabled": true,
          "accountName": "[J4]PayAccount",
          "accountType": "payment",
          "remarks": "[广州]生产勿动",
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "孙泽升",
          "updatedTime": "2025-12-17T14:47:14.3815357+08:00",
          "createdTime": "2025-12-17T14:47:14.3815372+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-QPM5T0QX-4578",
        "operator": "孙泽升",
        "time": "2025-12-17T14:47:35.6743491+08:00"
      }
    ]
  },
  {
    "id": "CA-GTXE697S-58",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-FUFBWIDZ-9115",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-G9-V1",
    "groupCode": "INITIAL",
    "accountName": "[G9]Apiushine",
    "scaleLimited": 96000,
    "queryLimited": -96000,
    "scaleLimitedDaysLength": 2,
    "remarks": "**[Query exceeded limited! Current[-96001][-96000]]***",
    "contactName": "cheng/franco",
    "phoneNumber": "86/150017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "孙泽升",
    "updatedTime": "2026-03-02T15:25:47.6818984+08:00",
    "createdTime": "2025-11-05T20:58:23.9312433+08:00",
    "expandSettings": [
      {
        "indexId": "CA-GTXE697S-58",
        "value": "ABYORIENTALAPI",
        "name": "UserName"
      },
      {
        "indexId": "CA-GTXE697S-58",
        "value": "AACOLA3879",
        "name": "AgentCode"
      },
      {
        "indexId": "CA-GTXE697S-58",
        "value": "OTA",
        "name": "AirlineId"
      },
      {
        "indexId": "CA-GTXE697S-58",
        "value": "ORIENTALAPI",
        "name": "AgentName"
      },
      {
        "indexId": "CA-GTXE697S-58",
        "value": "CN/OLA",
        "name": "Pos"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-GTXE697S-58",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-MOEKGCMX-674",
          "branchId": "B-FUFBWIDZ-9115",
          "isEnabled": true,
          "accountName": "[G9]PayAccount",
          "accountType": "payment",
          "remarks": "[新疆]生产勿动",
          "contactName": "cheng/franco",
          "phoneNumber": "86/150017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "孙泽升",
          "updatedTime": "2025-11-05T21:01:27.5060079+08:00",
          "createdTime": "2025-11-05T21:01:27.5060101+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-MOEKGCMX-674",
        "operator": "孙泽升",
        "time": "2025-11-05T21:01:42.4774074+08:00"
      }
    ]
  },
  {
    "id": "CA-WVPT1VNO-7682",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-FUFBWIDZ-9115",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-3T-V1",
    "groupCode": "INITIAL",
    "accountName": "[3T]apiushine",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 2,
    "remarks": "**[Query exceeded limited! Current[-16016][-16000]]***",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "陈娜",
    "updatedTime": "2026-04-24T08:37:45.9787022+08:00",
    "createdTime": "2025-11-05T20:51:42.2336527+08:00",
    "expandSettings": [],
    "paymentSettings": [
      {
        "channelAccountId": "CA-WVPT1VNO-7682",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-TX0EXFCV-6480",
          "branchId": "B-FUFBWIDZ-9115",
          "isEnabled": true,
          "accountName": "[3T]PayAccount",
          "accountType": "payment",
          "remarks": "[新疆]生产勿动",
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "孙泽升",
          "updatedTime": "2025-11-05T20:55:05.4912+08:00",
          "createdTime": "2025-11-05T20:55:05.4912022+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-TX0EXFCV-6480",
        "operator": "孙泽升",
        "time": "2025-11-05T20:55:22.3116002+08:00"
      }
    ]
  },
  {
    "id": "CA-JV8QOHXP-2738",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-Z5OWWPC2-6899",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-G9-V1",
    "groupCode": "INITIAL",
    "accountName": "[G9]Apiushine",
    "scaleLimited": 96000,
    "queryLimited": -96000,
    "scaleLimitedDaysLength": 15,
    "remarks": "**[Query exceeded limited! Current[-96212][-96000]]***",
    "contactName": "cheng/franco",
    "phoneNumber": "86/150017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "孙泽升",
    "updatedTime": "2026-04-13T11:28:42.7317871+08:00",
    "createdTime": "2025-11-04T16:24:04.6375355+08:00",
    "expandSettings": [
      {
        "indexId": "CA-JV8QOHXP-2738",
        "value": "ABYORIENTALAPI",
        "name": "UserName"
      },
      {
        "indexId": "CA-JV8QOHXP-2738",
        "value": "AACOLA3879",
        "name": "AgentCode"
      },
      {
        "indexId": "CA-JV8QOHXP-2738",
        "value": "OTA",
        "name": "AirlineId"
      },
      {
        "indexId": "CA-JV8QOHXP-2738",
        "value": "ORIENTALAPI",
        "name": "AgentName"
      },
      {
        "indexId": "CA-JV8QOHXP-2738",
        "value": "CN/OLA",
        "name": "Pos"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-JV8QOHXP-2738",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-RRGRTISL-6123",
          "branchId": "B-Z5OWWPC2-6899",
          "isEnabled": true,
          "accountName": "[G9]PayAccount",
          "accountType": "payment",
          "remarks": "[广州]生产勿动",
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "孙泽升",
          "updatedTime": "2025-11-04T16:27:58.4846212+08:00",
          "createdTime": "2025-11-04T16:27:58.4846224+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-RRGRTISL-6123",
        "operator": "孙泽升",
        "time": "2025-11-04T16:28:14.0526145+08:00"
      }
    ]
  },
  {
    "id": "CA-CXFJCYXR-6402",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-Z5OWWPC2-6899",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-3T-V1",
    "groupCode": "INITIAL",
    "accountName": "apiushine3T",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 15,
    "remarks": "[广州]生产勿动",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "刘海波",
    "updatedTime": "2025-12-29T07:18:49.9130444+08:00",
    "createdTime": "2025-10-20T14:33:34.3534959+08:00",
    "expandSettings": [],
    "paymentSettings": [
      {
        "channelAccountId": "CA-CXFJCYXR-6402",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-AITBYGpM-6727",
          "branchId": "B-Z5OWWPC2-6899",
          "isEnabled": true,
          "accountName": "[3T]PayAccount",
          "accountType": "payment",
          "remarks": "[广州]生产勿动",
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "孙泽升",
          "updatedTime": "2025-12-17T14:47:57.7315129+08:00",
          "createdTime": "2025-10-20T14:50:23.831712+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-AITBYGpM-6727",
        "operator": "孙泽升",
        "time": "2025-10-20T17:23:24.373217+08:00"
      }
    ]
  },
  {
    "id": "CA-YXAED8HO-2094",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-GEFQD6zC-9794",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-KA-V1",
    "groupCode": "INITIAL",
    "accountName": "[KA]Apiushine",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 15,
    "remarks": "[阿曼][生产勿动]",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "孙泽升",
    "updatedTime": "2026-03-25T11:34:01.6976137+08:00",
    "createdTime": "2025-07-17T18:39:42+08:00",
    "expandSettings": [
      {
        "indexId": "CA-YXAED8HO-2094",
        "value": "https://reservations.aeronomad.kg/wsbe/rest",
        "name": "Host"
      },
      {
        "indexId": "CA-YXAED8HO-2094",
        "value": "BJSTA001",
        "name": "AgentCode"
      },
      {
        "indexId": "CA-YXAED8HO-2094",
        "value": "USD",
        "name": "Currency"
      },
      {
        "indexId": "CA-YXAED8HO-2094",
        "value": "KA",
        "name": "AirlineId"
      },
      {
        "indexId": "CA-YXAED8HO-2094",
        "value": "ORIENTAL SKY OTA",
        "name": "AgentName"
      },
      {
        "indexId": "CA-YXAED8HO-2094",
        "value": "KG",
        "name": "Pos"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-YXAED8HO-2094",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-D74SPBSY-1093",
          "branchId": "B-GEFQD6zC-9794",
          "isEnabled": true,
          "accountName": "[KA]PayAccount",
          "accountType": "payment",
          "remarks": "[阿曼][生产勿动]",
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "刘海波",
          "updatedTime": "2025-07-25T18:13:59.5592443+08:00",
          "createdTime": "2025-07-25T18:13:59.5592452+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-D74SPBSY-1093",
        "operator": "刘海波",
        "time": "2025-09-03T21:28:25.1176916+08:00"
      }
    ]
  },
  {
    "id": "CA-YXAED8HO-2876",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-FUFBWIDZ-9115",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-KA-V1",
    "groupCode": "INITIAL",
    "accountName": "[KA]Apiushine",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 15,
    "remarks": "**[Query exceeded limited! Current[-16004][-16000]]***",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "陈娜",
    "updatedTime": "2026-04-26T15:46:33.0438733+08:00",
    "createdTime": "2025-07-17T18:39:42+08:00",
    "expandSettings": [
      {
        "indexId": "CA-YXAED8HO-2876",
        "value": "https://reservations.aeronomad.kg/wsbe/rest",
        "name": "Host"
      },
      {
        "indexId": "CA-YXAED8HO-2876",
        "value": "BJSTA001",
        "name": "AgentCode"
      },
      {
        "indexId": "CA-YXAED8HO-2876",
        "value": "USD",
        "name": "Currency"
      },
      {
        "indexId": "CA-YXAED8HO-2876",
        "value": "KA",
        "name": "AirlineId"
      },
      {
        "indexId": "CA-YXAED8HO-2876",
        "value": "ORIENTAL SKY OTA",
        "name": "AgentName"
      },
      {
        "indexId": "CA-YXAED8HO-2876",
        "value": "KG",
        "name": "Pos"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-YXAED8HO-2876",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-D74SPBSY-5433",
          "branchId": "B-FUFBWIDZ-9115",
          "isEnabled": true,
          "accountName": "[KA]PayAccount",
          "accountType": "payment",
          "remarks": "[新疆][生产勿动]",
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "刘海波",
          "updatedTime": "2025-07-25T18:13:59.5592443+08:00",
          "createdTime": "2025-07-25T18:13:59.5592452+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-D74SPBSY-5433",
        "operator": "刘海波",
        "time": "2025-09-03T21:26:09.1951988+08:00"
      }
    ]
  },
  {
    "id": "CA-YXAED8HO-4892",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-J6L9QLOZ-4867",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-KA-V1",
    "groupCode": "INITIAL",
    "accountName": "[KA]Apiushine",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 15,
    "remarks": "[吉尔吉斯斯坦][生产勿动]",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "刘海波",
    "updatedTime": "2025-09-03T21:01:28.0877533+08:00",
    "createdTime": "2025-07-17T18:39:42+08:00",
    "expandSettings": [
      {
        "indexId": "CA-YXAED8HO-4892",
        "value": "https://reservations.aeronomad.kg/wsbe/rest",
        "name": "Host"
      },
      {
        "indexId": "CA-YXAED8HO-4892",
        "value": "BJSTA001",
        "name": "AgentCode"
      },
      {
        "indexId": "CA-YXAED8HO-4892",
        "value": "USD",
        "name": "Currency"
      },
      {
        "indexId": "CA-YXAED8HO-4892",
        "value": "KA",
        "name": "AirlineId"
      },
      {
        "indexId": "CA-YXAED8HO-4892",
        "value": "ORIENTAL SKY OTA",
        "name": "AgentName"
      },
      {
        "indexId": "CA-YXAED8HO-4892",
        "value": "KG",
        "name": "Pos"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-YXAED8HO-4892",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-D74SPBSY-2856",
          "branchId": "B-J6L9QLOZ-4867",
          "isEnabled": true,
          "accountName": "[KA]PayAccount",
          "accountType": "payment",
          "remarks": "[吉尔吉斯斯坦][生产勿动]",
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "刘海波",
          "updatedTime": "2025-07-25T18:13:59.5592443+08:00",
          "createdTime": "2025-07-25T18:13:59.5592452+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-D74SPBSY-2856",
        "operator": "刘海波",
        "time": "2025-09-03T21:28:25.1176916+08:00"
      }
    ]
  },
  {
    "id": "CA-YXAED8HO-6538",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-3FG7UKYV-7643",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-KA-V1",
    "groupCode": "INITIAL",
    "accountName": "[KA]Apiushine",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 15,
    "remarks": "[迪拜][生产勿动]",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "刘海波",
    "updatedTime": "2025-09-03T21:01:28.0877533+08:00",
    "createdTime": "2025-07-17T18:39:42+08:00",
    "expandSettings": [
      {
        "indexId": "CA-YXAED8HO-6538",
        "value": "https://reservations.aeronomad.kg/wsbe/rest",
        "name": "Host"
      },
      {
        "indexId": "CA-YXAED8HO-6538",
        "value": "BJSTA001",
        "name": "AgentCode"
      },
      {
        "indexId": "CA-YXAED8HO-6538",
        "value": "USD",
        "name": "Currency"
      },
      {
        "indexId": "CA-YXAED8HO-6538",
        "value": "KA",
        "name": "AirlineId"
      },
      {
        "indexId": "CA-YXAED8HO-6538",
        "value": "ORIENTAL SKY OTA",
        "name": "AgentName"
      },
      {
        "indexId": "CA-YXAED8HO-6538",
        "value": "KG",
        "name": "Pos"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-YXAED8HO-6538",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-D74SPBSY-3655",
          "branchId": "B-3FG7UKYV-7643",
          "isEnabled": true,
          "accountName": "[KA]PayAccount",
          "accountType": "payment",
          "remarks": "[迪拜][生产勿动]",
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "刘海波",
          "updatedTime": "2025-07-25T18:13:59.5592443+08:00",
          "createdTime": "2025-07-25T18:13:59.5592452+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-D74SPBSY-3655",
        "operator": "刘海波",
        "time": "2025-09-03T21:28:25.1176916+08:00"
      }
    ]
  },
  {
    "id": "CA-YXAED8HO-9002",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-Z5OWWPC2-6899",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-KA-V1",
    "groupCode": "INITIAL",
    "accountName": "[KA]Apiushine",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 15,
    "remarks": "[广州][生产勿动]",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "刘海波",
    "updatedTime": "2025-10-08T20:28:34.8754499+08:00",
    "createdTime": "2025-07-17T18:39:42+08:00",
    "expandSettings": [
      {
        "indexId": "CA-YXAED8HO-9002",
        "value": "https://reservations.aeronomad.kg/wsbe/rest",
        "name": "Host"
      },
      {
        "indexId": "CA-YXAED8HO-9002",
        "value": "BJSTA001",
        "name": "AgentCode"
      },
      {
        "indexId": "CA-YXAED8HO-9002",
        "value": "USD",
        "name": "Currency"
      },
      {
        "indexId": "CA-YXAED8HO-9002",
        "value": "KA",
        "name": "AirlineId"
      },
      {
        "indexId": "CA-YXAED8HO-9002",
        "value": "ORIENTAL SKY OTA",
        "name": "AgentName"
      },
      {
        "indexId": "CA-YXAED8HO-9002",
        "value": "KG",
        "name": "Pos"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-YXAED8HO-9002",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-D74SPBSY-213",
          "branchId": "B-Z5OWWPC2-6899",
          "isEnabled": true,
          "accountName": "[KA]PayAccount",
          "accountType": "payment",
          "remarks": "[广州][生产勿动]",
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "刘海波",
          "updatedTime": "2025-10-30T13:41:34.4988116+08:00",
          "createdTime": "2025-07-25T18:13:59.5592452+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-D74SPBSY-213",
        "operator": "刘海波",
        "time": "2025-07-25T18:14:11.0137017+08:00"
      }
    ]
  },
  {
    "id": "CA-YXAED8HO-9089",
    "groupId": "G-NYT7JV7U-7748",
    "branchId": "B-YYVGF4CD-5039",
    "branchIds": [],
    "isEnabled": true,
    "channelCode": "API-KA-V1",
    "groupCode": "INITIAL",
    "accountName": "[KA]Apiushine",
    "scaleLimited": 8000,
    "queryLimited": -16000,
    "scaleLimitedDaysLength": 15,
    "remarks": "[上海][生产勿动]",
    "contactName": "cheng/franco",
    "phoneNumber": "86/15017518883",
    "emailAddress": "franco.cheng@ushineaviation.com",
    "operator": "刘海波",
    "updatedTime": "2025-09-03T21:01:28.0877533+08:00",
    "createdTime": "2025-07-17T18:39:42+08:00",
    "expandSettings": [
      {
        "indexId": "CA-YXAED8HO-9089",
        "value": "https://reservations.aeronomad.kg/wsbe/rest",
        "name": "Host"
      },
      {
        "indexId": "CA-YXAED8HO-9089",
        "value": "BJSTA001",
        "name": "AgentCode"
      },
      {
        "indexId": "CA-YXAED8HO-9089",
        "value": "USD",
        "name": "Currency"
      },
      {
        "indexId": "CA-YXAED8HO-9089",
        "value": "KA",
        "name": "AirlineId"
      },
      {
        "indexId": "CA-YXAED8HO-9089",
        "value": "ORIENTAL SKY OTA",
        "name": "AgentName"
      },
      {
        "indexId": "CA-YXAED8HO-9089",
        "value": "KG",
        "name": "Pos"
      }
    ],
    "paymentSettings": [
      {
        "channelAccountId": "CA-YXAED8HO-9089",
        "channelAccount": null,
        "paymentAccount": {
          "id": "PA-D74SPBSY-8762",
          "branchId": "B-YYVGF4CD-5039",
          "isEnabled": true,
          "accountName": "[KA]PayAccount",
          "accountType": "payment",
          "remarks": "[上海][生产勿动]",
          "contactName": "cheng/franco",
          "phoneNumber": "86/15017518883",
          "emailAddress": "franco.cheng@ushineaviation.com",
          "operator": "刘海波",
          "updatedTime": "2025-07-25T18:13:59.5592443+08:00",
          "createdTime": "2025-07-25T18:13:59.5592452+08:00",
          "expandSettings": [],
          "paymentSettings": [
            null
          ]
        },
        "paymentAccountId": "PA-D74SPBSY-8762",
        "operator": "刘海波",
        "time": "2025-09-03T21:27:07.3443332+08:00"
      }
    ]
  }
]
export default function FoundationBooking() {
    return (
        <section className={'container'}>
          <div className={'flex items-center py-2 px-2 z-99 sticky top-(--header-height) left-0 bg-(--bg)'}>
            <SearchBar className={'flex-1'} placeholder={'渠道'} style={{'--background': '#e8e9ed' ,'--border-radius':'20px'}} />
          </div>
          <div className={'p-2'}>
            {
              list.map((item) => (
                <Card className={'mb-2'} title={<span className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{item.channelCode}(<span className={'text-red-500'}>{item.groupCode}</span>)</span>}
                      extra={<Tag round
                                  color={!item.isEnabled ? 'danger' : 'success'}>{JSON.stringify(item.isEnabled)}</Tag>}
                      key={item.id}>
                  <div className={'text-left'}>
                    <p className={'line-clamp-1 font-normal text-[1rem]'}>{item.branchId}</p>
                  </div>
                  <div className={'text-left'}>
                    <h4 className={'text-black font-bold text-[1.3rem] my-4'}>基础信息</h4>
                    <CardText label={'账户名称'} value={item.accountName} />
                    <CardText label={'查定比设置'} value={item.scaleLimited} />
                    <CardText label={'查询限制'} value={item.queryLimited} />
                    <CardText label={'向前推算天数'} value={item.scaleLimitedDaysLength} />
                    <CardText label={'备注'} value={item.remarks} valueStyle={'line-clamp-3'} />
                  </div>
                  <Divider />
                  <div className={'flex justify-end'}>
                    <Space justify={'end'}>
                      <Button shape='rounded' size={'small'}>Reset Verification</Button>

                    </Space>
                  </div>
                </Card>
              ))
            }
          </div>
        </section>
    )
}
