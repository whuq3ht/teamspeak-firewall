#!/usr/bin/env node

const { execSync } = require("child_process");
const os = require("os");

const platform = os.platform();
const isWindows = platform === "win32";
const isLinux = platform === "linux";

const YAPIMCI = {
  github: "https://github.com/whuq3ht",
  instagram: "https://instagram.com/haktan0zturk"
};

function yazdirYapimci() {
  console.log("\n--- Yapımcı Bilgileri ---");
  console.log("GitHub   :", YAPIMCI.github);
  console.log("Instagram:", YAPIMCI.instagram);
  console.log("-------------------------\n");
}

function destekKontrol() {
  if (isWindows) {
    console.log("⚠️ Windows sistemlerde iptables komutları desteklenmez.");
    yazdirYapimci();
    process.exit(1);
  }
}

function firewallKur() {
  destekKontrol();

  try {
    console.log("Firewall kuruluyor...");

    execSync("iptables -F");
    execSync("iptables -X");

    execSync("iptables -A INPUT -p icmp -j ACCEPT");
    execSync("iptables -A INPUT -i lo -j ACCEPT");
    execSync("iptables -A INPUT -m geoip ! --src-cc TR -j DROP");

    execSync("iptables -A INPUT -p tcp --syn -m connlimit --connlimit-above 2 -j REJECT");

    execSync("iptables -A INPUT -p udp --dport 9987 -m limit --limit 10/second --limit-burst 20 -j ACCEPT");
    execSync("iptables -A INPUT -p tcp --dport 10011 -m limit --limit 5/second --limit-burst 10 -j ACCEPT");
    execSync("iptables -A INPUT -p tcp --dport 30033 -m limit --limit 5/second --limit-burst 10 -j ACCEPT");

    execSync("iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set");
    execSync("iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 5 -j DROP");

    execSync("iptables -A INPUT -j DROP");

    console.log("✅ Firewall başarıyla kuruldu.");
  } catch (err) {
    console.error("❌ Hata:", err.message);
  }
}

function firewallTemizle() {
  destekKontrol();

  try {
    console.log("Firewall temizleniyor...");
    execSync("iptables -F");
    execSync("iptables -X");
    console.log("✅ Firewall kuralları sıfırlandı.");
  } catch (err) {
    console.error("❌ Hata:", err.message);
  }
}

process.on("SIGINT", () => {
  console.log("\n\nCTRL+C ile çıkış yapılıyor...");
  yazdirYapimci();
  process.exit(0);
});

process.on("exit", () => {
  yazdirYapimci();
});

const arg = process.argv[2];
if (arg === "kur") {
  firewallKur();
} else if (arg === "temizle") {
  firewallTemizle();
} else {
  console.log("Kullanım:");
  console.log("  node firewall.js kur       # Firewall kur");
  console.log("  node firewall.js temizle   # Firewall temizle");
  yazdirYapimci();
}
