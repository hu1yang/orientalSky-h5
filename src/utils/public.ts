import {resolveLocale} from "@/utils/local.ts";
import {t} from "i18next";
import copy from 'copy-to-clipboard'
import {Toast} from "antd-mobile";

export const getLocale = resolveLocale()

export function generateCompanyCode(): string {
  const prefix = 'CMP'
  const datePart = new Date().toISOString().split('T')[0].replace(/-/g, '')
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()

  return `${prefix}-${datePart}-${randomPart}`
}

export function getCssVar(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
}

// 参数规范化：空字符串转为 null（递归处理嵌套对象）
export function normalizeParams<T>(params?: T): T {
  if (!params || typeof params !== 'object') return params as T

  const result: any = Array.isArray(params) ? [] : {}
  for (const key in params) {
    const value = (params as any)[key]
    result[key] =
      value === ''
        ? null
        : typeof value === 'object'
          ? normalizeParams(value)
          : value
  }
  return result
}

export function result(response: {
  succeed:boolean
  message:string
}){
  if (response.succeed) {
    Toast.show({
      icon: 'success',
      content: t('common.operationSuccessful'),
    })
  } else {
    Toast.show({
      icon: 'fail',
      content: response.message,
    })
  }
}

export const copyText = async (text:string) => {
  try {
    await copy(text)
    Toast.show({
      icon: 'success',
      content: t('common.copySuccess'),
    })
  } catch {
    Toast.show({
      icon: 'fail',
      content: t('common.copyError'),
    })
  }
}

export const passengerTypes = {
  adt: 'Adult',
  chd: 'Child',
  inf: 'Infant',
} as const;
