import ip from "ip"
import snmp from "snmp-native";
import Bluebird from "bluebird";
import Host from "./Host.js";

const hostname_oid = [1, 3, 6, 1, 2, 1, 1, 5, 0]

export default {
    async scanHosts(cidr: string): Promise<Host[]> {
        const network = ip.cidrSubnet(cidr)
        const firstLong = ip.toLong(network.firstAddress)
        const lastLong = ip.toLong(network.lastAddress)

        const session = new snmp.Session()
        const asyncGet = Bluebird.promisify(session.get, {context: session})
        const hosts = []

        for(let i = firstLong; i <= lastLong; i++) {
            try {
                console.debug("trying " + ip.fromLong(i))
                const response = await asyncGet({oid: hostname_oid, host: ip.fromLong(i), community: 'public', timeouts: [50, 30, 10, 5]})
                hosts.push(new Host(ip.fromLong(i), response[0].value))
            } catch (e) {
            }
        }

        session.close()
        return hosts
    },
}


