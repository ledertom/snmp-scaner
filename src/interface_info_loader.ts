import Host from "./Host.js";
import snmp from "snmp-native";
import Bluebird from "bluebird";
import ip from "ip";

const ifnumber_oid = [1, 3, 6, 1, 2, 1, 1, 5, 0]
const ifname_oid = [1, 3, 6, 1, 2, 1, 31, 1, 1, 1, 1]

export default {
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