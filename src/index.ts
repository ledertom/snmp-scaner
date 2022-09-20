import Host from "./Host";
import host_scanner from "./host_scanner"
import ip from "ip";

const cidr = process.argv[2]

let network
try {
    network = ip.cidrSubnet(cidr)
} catch (e) {
    console.error("Invalid input. First argument should be network address in CIDR format, e.g. '10.6.6.0/24'")
    process.exit(1)
}

console.log("Scanning network " + cidr)
const scanner = host_scanner.createScanner(network)

scanner.subscribe({
    next: (host: Host) => host.print(),
    error: error => console.error("Scan failed. Error: " + error),
    complete: () => console.log("Scan finished.")
}
)