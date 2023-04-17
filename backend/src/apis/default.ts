import CSRF from 'csrf'

const csrf = new CSRF()

export default class DefaultHandler {
    public static generateCSRFToken() {
        const secret = csrf.secretSync()
        return csrf.create(secret)
    }
}