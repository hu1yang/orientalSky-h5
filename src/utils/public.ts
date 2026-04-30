import {resolveLocale} from "@/utils/local.ts";
import {t} from "i18next";
import {Toast} from "antd-mobile";

export const getLocale = resolveLocale()

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
