import defineError from '@sumor/error'

const LibraryError = defineError({
  code: {
    REDIRECT_PORT_NOT_AVAILABLE: 'Port {port} is not available'
  },
  // languages: en, zh, es, ar, fr, ru, de, pt, ja, ko
  i18n: {
    en: {
      REDIRECT_PORT_NOT_AVAILABLE: 'Port {port} is not available'
    },
    zh: {
      REDIRECT_PORT_NOT_AVAILABLE: '端口 {port} 不可用'
    },
    es: {
      REDIRECT_PORT_NOT_AVAILABLE: 'El puerto {port} no está disponible'
    },
    ar: {
      REDIRECT_PORT_NOT_AVAILABLE: 'المنفذ {port} غير متاح'
    },
    fr: {
      REDIRECT_PORT_NOT_AVAILABLE: "Le port {port} n'est pas disponible"
    },
    ru: {
      REDIRECT_PORT_NOT_AVAILABLE: 'Порт {port} недоступен'
    },
    de: {
      REDIRECT_PORT_NOT_AVAILABLE: 'Port {port} ist nicht verfügbar'
    },
    pt: {
      REDIRECT_PORT_NOT_AVAILABLE: 'A porta {port} não está disponível'
    },
    ja: {
      REDIRECT_PORT_NOT_AVAILABLE: 'ポート {port} は利用できません'
    },
    ko: {
      REDIRECT_PORT_NOT_AVAILABLE: '포트 {port}를 사용할 수 없습니다'
    }
  }
})

export default LibraryError
