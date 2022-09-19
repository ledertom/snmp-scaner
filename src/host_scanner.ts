import ip, {SubnetInfo} from "ip"
import snmp from "snmp-native";
import Bluebird from "bluebird";
import Host from "./Host.js";

const hostname_oid = [1, 3, 6, 1, 2, 1, 1, 5, 0]
const ifnumber_oid = [1, 3, 6, 1, 2, 1, 1, 5, 0]
const ifname_oid = [1, 3, 6, 1, 2, 1, 31, 1, 1, 1, 1]

export default {
    async scanHosts(network: SubnetInfo): Promise<Host[]> {
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

    async getInterfaceInfo(host : Host): Promise<Host> {
        const session = new snmp.Session()
        const asyncGetNext = Bluebird.promisify(session.getSubtree, {context: session})

        let oid = ifname_oid
        try {
            const response = await asyncGetNext({
                oid: oid,
                host: host.ip,
                community: 'private',
                timeouts: [100, 50, 50, 50]
            })

            for (let nic of response) {
                host.interfaces.push(nic.value)
            }

        } catch (e) {
        }
        return host
    }
}


