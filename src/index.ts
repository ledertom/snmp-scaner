import host_scanner from "./host_scanner.js"
import interface_info_loader from "./interface_info_loader.js"

const hosts = await host_scanner.scanHosts("10.6.6.0/24")

for(let host of hosts)
    await interface_info_loader.getInterfaceInfo(host)

console.log(JSON.stringify(hosts, null, 2))

process.exit(0)