import ip, {SubnetInfo} from "ip"
import snmp from "snmp-native";
import Bluebird from "bluebird";
import Host from "./Host.js";

const hostname_oid = [1, 3, 6, 1, 2, 1, 1, 5, 0]
const ifname_oid = [1, 3, 6, 1, 2, 1, 31, 1, 1, 1, 1]

export default {
    async scanHosts(network: SubnetInfo): Promise<Host[]> {
        const firstLong = ip.toLong(network.firstAddress)
        const lastLong = ip.toLong(network.lastAddress)

        const session = new snmp.Session()
        const hosts = []

        for(let i = firstLong; i <= lastLong; i++) {
            let host = await tryIp(session, i)
            if(host)
                hosts.push(host)
        }

        session.close()
        return hosts
    },
}

async function tryIp(session : snmp.Session, ipLong : number) : Promise<Host | null> {
    const asyncGet = Bluebird.promisify(session.get, {context: session})
    const asyncGetNext = Bluebird.promisify(session.getSubtree, {context: session})
    const addr = ip.fromLong(ipLong)

    try {
        console.debug("trying " + addr)
        const hostname_response = await asyncGet({
            oid: hostname_oid,
            host: addr,
            community: 'public',
            timeouts: [50, 30, 10, 5]
        })
        const host = new Host(addr, hostname_response[0].value)

        const response = await asyncGetNext({
            oid: ifname_oid,
            host: addr,
            community: 'private',
            timeouts: [100, 50, 50, 50]
        })

        for (let nic of response)
            host.interfaces.push(nic.value)

        return host
    } catch (e) {
        return null
    }
}


