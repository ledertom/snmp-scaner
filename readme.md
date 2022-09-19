# SNMP network scanner
This is a basic tool for scanning netowrk for running snmp agents, providing hostname and interface list.

## Run in test environment
You will need docker and docker-compose installed on your computer.

First, build scanner image:
```bash
docker-compose build
```

then create snmp services (hint: you can manage number of running services by changing value of `replicas` in file `docker-compose.yml`)
```bash
docker-compose up -d agent
```

when all is started (wait for a bit after last command), you can scan your created agents by
```bash
docker-compose up scanner
```

after you work is done, you can turn off agents via
```bash
docker-compose down
```

## Run locally

You will need npm installed on your computer.

install dependencies
```bash
npm install
```

compile typescript
```bash
npm run build
```

and run the application. Replace <network> with network address in CIDR format, e.g. 10.6.6.0/24
```bash
node build/index.js <network>
```