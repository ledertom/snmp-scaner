import host_scanner from "./host_scanner.js"
import ip from "ip";

const cidr = process.argv[2]

let network
try {
    network = ip.cidrSubnet(cidr)
} catch (e) {
    console.error("Invalid input. First argument should be network address in CIDR format, e.g. '10.6.6.0/24'")
    process.exit(1)
}

const hosts = await host_scanner.scanHosts(network)

for(let host of hosts)
    await host_scanner.getInterfaceInfo(host)

console.log(JSON.stringify(hosts))
hosts.forEach(host => host.print())

process.exit(0)