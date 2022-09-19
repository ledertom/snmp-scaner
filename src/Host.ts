export default class {
    ip : string
    hostname: string
    interfaces: string[]

    constructor(ip: string, hostname: string) {
        this.ip = ip;
        this.hostname = hostname;
        this.interfaces = []
    }

    print() {
        const nics = this.interfaces.join(", ")
        console.log([this.ip, this.hostname, nics].join("; "))
    }
}