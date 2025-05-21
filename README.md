# TR Lokasyon Firewall Scripti

Bu script, Türkiye lokasyonlu bir sunucuda çalışacak şekilde Node.js ile yazılmıştır. Saldırı anında:

- Yurt dışı trafiğini keser
- Mikrotik ile uyumludur
- Belirli portlara limit koyar (9987, 10011, 30033, 22)
- Maksimum 2 IP bağlantı sınırı uygular
- CTRL+C veya normal çıkışta yapımcı bilgisi gösterir

## Kurulum

```bash
sudo apt install xtables-addons-common -y
modprobe xt_geoip
```

## Kullanım

```bash
node firewall.js kur       # Firewall kur
node firewall.js temizle   # Kuralları sıfırla
```

## Yapımcı

- GitHub: [whuq3ht](https://github.com/whuq3ht)
- Instagram: [@haktan0zturk](https://instagram.com/haktan0zturk)
