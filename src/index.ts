import host_scanner from "./host_scanner.js"
import interface_info_loader from "./interface_info_loader.js"

const cidr = process.argv[2]
console.log(JSON.stringify(process.argv))
console.log(cidr)
const hosts = await host_scanner.scanHosts(cidr)

for(let host of hosts)
    await interface_info_loader.getInterfaceInfo(host)

console.log(JSON.stringify(hosts, null, 2))

process.exit(0)