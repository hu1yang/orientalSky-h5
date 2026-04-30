import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'

import {commonZh, commonEn, commonRu} from './lang/common.ts'
import {loginZh, loginEn, loginRu} from './lang/login.ts'
import {homeZh, homeEn, homeRu} from './lang/home.ts'
import {orderEn, orderZh, orderRu} from "@/i18n/lang/order.ts";
import {foundationEn, foundationZh, foundationRu} from "@/i18n/lang/foundation.ts";
import {groupEn, groupZh, groupRu} from "@/i18n/lang/group.ts";
import {personalEn, personalZh, personalRu} from "@/i18n/lang/personal.ts";
import {baseEn, baseZh, baseRu} from "@/i18n/lang/base.ts";
import {airportEn, airportZh, airportRu} from "@/i18n/lang/airport.ts";
import {quoteEn, quoteZh, quoteRu} from "@/i18n/lang/quote.ts";

import {resolveLocale} from "@/utils/local.ts";

const locale = resolveLocale()
i18n.use(initReactI18next).init({
  resources: {
    en_US: {
      translation: {
        ...commonEn, ...loginEn, ...homeEn, ...orderEn, ...foundationEn,
        ...groupEn, ...personalEn, ...baseEn, ...airportEn, ...quoteEn
      }
    },
    zh_CN: {
      translation: {
        ...commonZh, ...loginZh, ...homeZh, ...orderZh, ...foundationZh,
        ...groupZh, ...personalZh, ...baseZh, ...airportZh, ...quoteZh
      }
    },
    ru_RU: {
      translation: {
        ...commonRu, ...loginRu, ...homeRu, ...orderRu, ...foundationRu,
        ...groupRu, ...personalRu, ...baseRu, ...airportRu, ...quoteRu
      }

    }
  },
  lng: locale,
  fallbackLng: locale,
  interpolation: {
    escapeValue: false
  }
})


export default i18n
