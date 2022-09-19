import ip, {SubnetInfo} from "ip"
import snmp from "snmp-native";
import Bluebird from "bluebird";
import Host from "./Host.js";
import {Observable, Subscriber, of, range, delay, from, concatMap} from "rxjs";

const hostname_oid = [1, 3, 6, 1, 2, 1, 1, 5, 0]
const hostname_community = 'public'
const ifname_oid = [1, 3, 6, 1, 2, 1, 31, 1, 1, 1, 1]
const ifname_community = 'private'
const timeouts = [50, 30, 10, 5]
const schedulerDelay = 50

let counter = 0
let allCnt = 0

export default {
    createScanner(network: SubnetInfo): Observable<Host> {
        return new Observable((subscriber : Subscriber<Host>) => {
            const firstLong = ip.toLong(network.firstAddress)
            const lastLong = ip.toLong(network.lastAddress)
            const session = new snmp.Session()
            allCnt = lastLong - firstLong + 1

            from(range(0, allCnt))
                .pipe(concatMap(item => of(item).pipe(delay(schedulerDelay))))
                .subscribe(offset => tryIp(session, firstLong + offset, subscriber))
        })
    },
}

function tryIp(session : snmp.Session, ipLong : number, subscriber: Subscriber<Host>) {
    const addr = ip.fromLong(ipLong)

    session.get({
        oid: hostname_oid,
        host: addr,
        community: hostname_community,
        timeouts: timeouts
        },
        (err, varbinds) => {
            if(err) {
                handleCounter(session, subscriber)
                return
            }

            const host = new Host(addr, varbinds[0].value)

            session.getSubtree({
                oid: ifname_oid,
                host: addr,
                community: ifname_community,
                timeouts: timeouts
                },
                (errSub, varbindsSub) => {
                    if (!errSub)
                        varbindsSub.forEach(nic => host.interfaces.push(nic.value))

                    subscriber.next(host)
                    handleCounter(session, subscriber)
            })
    })
}

function handleCounter(session : snmp.Session, subscriber : Subscriber<Host>) {
    counter++
    if(counter == allCnt) {
        session.close()
        subscriber.complete()
    }
}


