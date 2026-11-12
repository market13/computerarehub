const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MASTER_MAPPING = {
  // === GAMING_KEYBOARD (14) ===
  'kb_zebronics_dlk01_wired': {
    cat: 'gaming_keyboard',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/jxw5g280/keyboard/multi-device-keyboard/z/6/2/zebronics-zeb-dlk01-usb-multimedia-keyboard-black-original-imafg82y7cavec2z.jpeg'
  },
  'kb_ant_esports_km540_wired': {
    cat: 'gaming_keyboard',
    url: 'https://rukminim2.flixcart.com/image/480/480/xif0q/computer-acc-combo/s/s/h/km540-keyboard-and-mouse-combo-2-ant-esports-original-imahgxydwg4rnzer.jpeg'
  },
  'kb_acer_okb010_wired': {
    cat: 'gaming_keyboard',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/jfwuz680/keyboard/desktop-keyboard/d/w/u/acer-dk-usb1b-089-original-imaf49x89bsrbugt.jpeg'
  },
  'kb_geonix_gx_k100_wired': {
    cat: 'gaming_keyboard',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/keyboard/multi-device-keyboard/g/c/h/gxwbk-01-geonix-original-imagtfugc6thks5k.jpeg'
  },
  'kb_prodot_kb207s_wired': {
    cat: 'gaming_keyboard',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/jm9hfgw0/keyboard/desktop-keyboard/n/s/a/prodot-kb-207s-ps2-black-keyboard-original-imaf97sbnz7nmuyc.jpeg'
  },
  'kb_hp_100_wired': {
    cat: 'gaming_keyboard',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/l1v1uvk0/keyboard/3/o/p/-original-imagdc3v8xzfffyj.jpeg'
  },
  'kb_logitech_k120_wired': {
    cat: 'gaming_keyboard',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/keyboard/c/3/x/-original-imah2hcgmf66bhff.jpeg'
  },
  'kb_dell_kb216_wired': {
    cat: 'gaming_keyboard',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/k3bwrrk0/keyboard/desktop-keyboard/u/t/a/dell-kb-216-original-imafmgq7rxsgnu5m.jpeg'
  },
  'kb_tvs_champ_heavy_duty': {
    cat: 'gaming_keyboard',
    url: 'https://cdn.shopify.com/s/files/1/0590/3554/9892/products/002-ac1166f7-2952-4cbd-a454-a37991ef385c-_1_e949916d-c96f-4a5a-a100-abf0cbdf1e78.png?v=1666851868'
  },
  'kb_tvs_gold_bharat': {
    cat: 'gaming_keyboard',
    url: 'https://cdn.shopify.com/s/files/1/0590/3554/9892/products/31-_1_974a7f4b-e64e-4a7a-b824-0768acf38318.png?v=1745307648'
  },
  '981001': {
    cat: 'gaming_keyboard',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/files/1_39029002-5bd9-48a8-ba06-2f566744c6b0.webp?v=1757326053'
  },
  '981002': {
    cat: 'gaming_keyboard',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/files/1_00a40c74-556e-4b9f-a7e6-aea4ace62dce.webp?v=1757326736'
  },
  '970503': {
    cat: 'gaming_keyboard',
    url: 'https://cdn.shopify.com/s/files/1/0893/4165/7458/files/ClassicGold.jpg?v=1753345505'
  },
  '960103': {
    cat: 'gaming_keyboard',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/keyboard/keyboards/c/m/b/iball-winner-original-imadhy8r3gv7bhnb.jpeg'
  },

  // === GAMING_MOUSE (15) ===
  'mouse_ant_esports_gm320': {
    cat: 'gaming_mouse',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/mouse/m/u/l/gm320-ant-esports-original-imagvxxnwpma93cg.jpeg'
  },
  'mouse_zebronics_alex': {
    cat: 'gaming_mouse',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/mouse/n/a/i/zeb-alex-wired-optical-mouse-zebronics-original-imagnx6x5jbkbvgk.jpeg'
  },
  'mouse_acer_omr050': {
    cat: 'gaming_mouse',
    url: 'https://static-ecapac.acer.com/media/catalog/product/f/r/frame--1_27_un.38bsi.005.jpg'
  },
  'mouse_geonix_gxm20': {
    cat: 'gaming_mouse',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/mouse/i/e/0/wired-mouse-geonix-original-imah5bkapghtfr9t.jpeg'
  },
  'mouse_prodot_op249s': {
    cat: 'gaming_mouse',
    url: 'https://rukminim3.flixcart.com/image/356/352/xif0q/mouse/7/x/f/pro-253-prodot-original-imahzet8rp7nbdd9.jpeg'
  },
  'mouse_tvs_gold_companion': {
    cat: 'gaming_mouse',
    url: 'https://cdn.shopify.com/s/files/1/0590/3554/9892/files/Champ-M120_1.jpg?v=1745325617'
  },
  'mouse_tvs_champ': {
    cat: 'gaming_mouse',
    url: 'https://cdn.shopify.com/s/files/1/0590/3554/9892/products/TVSElectronicsChamppixl.jpg?v=1645616798'
  },
  'mouse_hp_x500': {
    cat: 'gaming_mouse',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/mouse/f/r/h/x500-hp-original-imahjv3yjudgsy23.jpeg'
  },
  'mouse_logitech_g102': {
    cat: 'gaming_mouse',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/kl175ow0/mouse/k/y/p/g102-light-sync-logitech-g-original-imagy8tqgfjrzp9a.jpeg'
  },
  'mouse_logitech_b100': {
    cat: 'gaming_mouse',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/mouse/u/x/k/-original-imahpantpcurzk9h.jpeg'
  },
  'mouse_dell_ms116': {
    cat: 'gaming_mouse',
    url: 'https://snpi.dell.com/snp/images2/627/4G2Y3_Main.jpg'
  },
  '981003': {
    cat: 'gaming_mouse',
    url: 'https://www.lapcare.com/cdn/shop/files/1_fcd98782-bf02-4c32-a97c-2ae62b29fbc1.webp'
  },
  '981004': {
    cat: 'gaming_mouse',
    url: 'http://www.lapcare.com/cdn/shop/files/1_8b31259c-25d9-4680-8553-f7eecd5c5b88.webp?v=1757326719'
  },
  '970504': {
    cat: 'gaming_mouse',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/jc0ttow0-1/mouse/z/k/w/consistent-ct-mo-nr-0501-original-imaff6tyfy6rzefh.jpeg'
  },
  '960104': {
    cat: 'gaming_mouse',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/k0463rk0/mouse/g/e/c/iball-style-63-optical-mouse-original-imafjz6hzdfdtpkd.jpeg'
  },

  // === MOTHERBOARD (16) ===
  '980101': {
    cat: 'motherboard',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/products/1_02d8ff54-575b-4b81-8ae0-e17b3a8998ae.jpg?v=1757326729'
  },
  '980102': {
    cat: 'motherboard',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/products/1_388b8471-8725-48c8-9bc5-d1a6a136cd35.webp?v=1757326359'
  },
  '980103': {
    cat: 'motherboard',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/products/1_92495494-2503-4eac-879b-7e9652b0a005.webp?v=1757326361'
  },
  '980104': {
    cat: 'motherboard',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/products/1_b9762d62-e41d-4c8c-a75d-0d5754020318.webp?v=1757326380'
  },
  '980105': {
    cat: 'motherboard',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/products/1_6d18eb2e-3738-4e6b-985a-0748e6ece8d0.webp?v=1757326360'
  },
  '980106': {
    cat: 'motherboard',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/motherboard/v/g/2/h61n-h61-lapcare-original-imagydyd2vsgvg9s.jpeg'
  },
  '980107': {
    cat: 'motherboard',
    url: 'https://m.media-amazon.com/images/I/71Cve98mhsL._SL1000_.jpg'
  },
  '970101': {
    cat: 'motherboard',
    url: 'https://cdn.shopify.com/s/files/1/0893/4165/7458/files/motherboardcmb61.jpg?v=1768034204'
  },
  '970102': {
    cat: 'motherboard',
    url: 'https://cdn.shopify.com/s/files/1/0893/4165/7458/files/cmbh81.jpg?v=1768034299'
  },
  '970103': {
    cat: 'motherboard',
    url: 'https://cdn.shopify.com/s/files/1/0893/4165/7458/files/CMBH510.jpg?v=1768034589'
  },
  '970104': {
    cat: 'motherboard',
    url: 'https://cdn.shopify.com/s/files/1/0893/4165/7458/files/CMB610.jpg?v=1768034625'
  },
  '970105': {
    cat: 'motherboard',
    url: 'https://m.media-amazon.com/images/I/71Cve98mhsL._SL1000_.jpg'
  },
  '950101': {
    cat: 'motherboard',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/motherboard/q/i/d/geonix-h61-geonix-original-imah2zanzbz83efv.jpeg'
  },
  '950102': {
    cat: 'motherboard',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/motherboard/n/z/t/gx-h81-d3-geonix-original-imagnzhhgkhhdg5v.jpeg'
  },
  '940101': {
    cat: 'motherboard',
    url: 'https://cdn.shopify.com/s/files/1/0356/9850/7909/products/ZEB-H61-pic1.jpg?v=1624942471'
  },
  '940102': {
    cat: 'motherboard',
    url: 'https://cdn.shopify.com/s/files/1/0356/9850/7909/products/ZEB-H81-pic-1.jpg?v=1653304221'
  },

  // === CPU (12) ===
  '980201': {
    cat: 'cpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/kcw9w280/processor/r/r/z/intel-i3-3220-original-imaftwqnfz7jachh.jpeg'
  },
  '980202': {
    cat: 'cpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/processor/c/r/2/core-i5-3470-intel-original-imags2fx2z3hqygd.jpeg'
  },
  '980203': {
    cat: 'cpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/kf2v3ww0/processor/t/u/y/intel-core-i5-4590-4th-generation-processor-original-imafvhk6nnchvyvx.jpeg'
  },
  '980204': {
    cat: 'cpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/processor/c/l/0/i7-4790-intel-original-imaheffyzb8dz8x3.jpeg'
  },
  '980205': {
    cat: 'cpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/kjiwfbk0-0/processor/u/p/q/core-i5-10400f-intel-original-imafz2xzzt2hu3tv.jpeg'
  },
  '970201': {
    cat: 'cpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/ksgehzk0/processor/k/t/t/i3-3240-intel-original-imag6yn9c9yrfx3n.jpeg'
  },
  '970202': {
    cat: 'cpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/processor/c/r/2/core-i5-3470-intel-original-imags2fx2z3hqygd.jpeg'
  },
  '970203': {
    cat: 'cpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/kjiwfbk0-0/processor/u/p/q/core-i5-10400f-intel-original-imafz2xzzt2hu3tv.jpeg'
  },
  '970204': {
    cat: 'cpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/processor/i/e/b/-enriched-transparent-original-imagngzvgahty8t6.png'
  },
  '910101': {
    cat: 'cpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/processor/i/e/b/-enriched-transparent-original-imagngzvgahty8t6.png'
  },
  '900101': {
    cat: 'cpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/processor/z/t/h/core-i7-13700-13th-generation-intel-original-imagzkf5bvdsrsu9.jpeg'
  },
  '890101': {
    cat: 'cpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/processor/z/f/x/-original-imagrzzre9zne4y5.jpeg'
  },

  // === GPU (15) ===
  '980301': {
    cat: 'gpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/graphics-card/m/w/p/asus-geforce-gt-710-original-imaejr3vjz9tebus.jpeg'
  },
  '980302': {
    cat: 'gpu',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/products/1_b302753b-87a9-4510-b32c-65de26610268.jpg?v=1757326748'
  },
  '980303': {
    cat: 'gpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/l29c9e80/graphics-card/3/i/c/colorfulgt1030-4g-v-colorful-original-imagdmusqxyr8tsc.jpeg'
  },
  '980304': {
    cat: 'gpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/graphics-card/d/a/o/rx-580-jieshuo-original-imahdqwhygjuubnq.jpeg'
  },
  '970301': {
    cat: 'gpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/graphics-card/m/w/p/asus-geforce-gt-710-original-imaejr3vjz9tebus.jpeg'
  },
  '970302': {
    cat: 'gpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/jyrl4sw0/graphics-card/d/3/k/galax-geforce-gt-730-4gb-ddr3-original-imafgwgg2m2z8fzq.jpeg'
  },
  '970303': {
    cat: 'gpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/ki4w0i80/graphics-card/u/3/n/zotac-gtx-1650-oc-original-imafyy4bdvhcujhe.jpeg'
  },
  '950103': {
    cat: 'gpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/j9n3ekw0/graphics-card/s/6/j/gigabyte-gt-710-original-imaezekjg4cgb3hv.jpeg'
  },
  '950104': {
    cat: 'gpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/graphics-card/4/a/u/nvidia-geforce-gt730lp-4gb-ddr3-geonix-original-imahf5useyr3htf2.jpeg'
  },
  '940103': {
    cat: 'gpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/graphics-card/k/3/g/gt730-zebronics-original-imah6y8ejd9m5bwu.jpeg'
  },
  '920101': {
    cat: 'gpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/graphics-card/g/g/m/arc-a770-intel-original-imagzfhjr8zhtffy.jpeg'
  },
  '920102': {
    cat: 'gpu',
    url: 'https://static-ecpa.acer.com/media/wysiwyg/Predator_Bifrost_RX7600_Aplus_KSP01.jpg'
  },
  '910102': {
    cat: 'gpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/graphics-card/e/e/v/geforce-rtx-4060-8gb-twin-edge-zotac-original-imaguxhdmegjwuny.jpeg'
  },
  '900102': {
    cat: 'gpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/graphics-card/a/9/e/dual-geforce-rtx-4070-12gb-gddr6x-gaming-graphics-card-asus-original-imagtyh4y6azd86d.jpeg'
  },
  '890102': {
    cat: 'gpu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/graphics-card/a/t/c/geforce-rtx-4080-16gb-gaming-x-slim-msi-original-imagunxgzggjc9tp.jpeg'
  },

  // === RAM (7) ===
  '980401': {
    cat: 'ram',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/products/2021-10-29T09-56-20.738ZLPDDRT5890.png?v=1757326616'
  },
  '980402': {
    cat: 'ram',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/products/2021-10-29T09-45-31.159ZLPDDR3R5954.png?v=1757326622'
  },
  '980403': {
    cat: 'ram',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/products/2021-10-29T10-00-45.248ZLSMEDT7354.png?v=1757326601'
  },
  '980404': {
    cat: 'ram',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/files/1_3a2802c7-d727-44ae-9a5c-df187a280979.webp?v=1757325681'
  },
  '980405': {
    cat: 'ram',
    url: 'https://cdn.shopify.com/s/files/1/0893/4165/7458/files/16GBDDR5DESKTOP.png?v=1753181816'
  },
  '970403': {
    cat: 'ram',
    url: 'https://cdn.shopify.com/s/files/1/0893/4165/7458/files/8gb_DDR4_DESKTOP_3200MHz_copy.jpg?v=1753181524'
  },
  '970404': {
    cat: 'ram',
    url: 'https://cdn.shopify.com/s/files/1/0893/4165/7458/files/32GB_DDR4_3200.jpg?v=1753181771'
  },

  // === STORAGE (7) ===
  '980501': {
    cat: 'storage',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/kql8sy80/internal-hard-drive/c/v/5/lapdisc-128gb-2-5-sata-ssd-compatible-with-desktop-laptop-original-imag4kapw9kh5xhm.jpeg'
  },
  '980502': {
    cat: 'storage',
    url: 'https://m.media-amazon.com/images/I/213ON3ZdrWL._SL1000_.jpg'
  },
  '980503': {
    cat: 'storage',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/internal-hard-drive/n/b/f/lapcare-losddg7671-lapcare-original-imah6gfnfzh7yfpf.jpeg'
  },
  '980504': {
    cat: 'storage',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/internal-hard-drive/l/j/u/lapdisc-lapcare-original-imagkxfju9krypqq.jpeg'
  },
  '980505': {
    cat: 'storage',
    url: 'https://m.media-amazon.com/images/I/71F8k20qddL._SL1000_.jpg'
  },
  '970401': {
    cat: 'storage',
    url: 'https://m.media-amazon.com/images/I/41JLlF80oML._SL1000_.jpg'
  },
  '970402': {
    cat: 'storage',
    url: 'https://m.media-amazon.com/images/I/51XYi4po7xL._SL1000_.jpg'
  },

  // === PSU (5) ===
  '980701': {
    cat: 'psu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/psu/s/b/c/lps450-lapcare-original-imagqq6jfmfkhygb.jpeg'
  },
  '980702': {
    cat: 'psu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/psu/y/z/v/lps414s-lapcare-original-imahruvuqzrfxprf.jpeg'
  },
  '980703': {
    cat: 'psu',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/files/1_afe78d1f-8a9e-462a-9272-79539edf7f4d.webp?v=1785581462'
  },
  '970502': {
    cat: 'psu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/psu/c/5/z/smps-450w-consistent-original-imahf9gjxqzsuyrz.jpeg'
  },
  '960102': {
    cat: 'psu',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/psu/t/d/d/iball-450w-computer-power-supply-pps-255-450w-computer-power-original-imae74mabgsjhsxr.jpeg'
  },

  // === COOLER (3) ===
  '980801': {
    cat: 'cooler',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/cooling-pad/9/d/e/-original-imahrc845rs6yvfp.jpeg'
  },
  '980802': {
    cat: 'cooler',
    url: 'https://m.media-amazon.com/images/I/51w-7vuSaQL._SL1000_.jpg'
  },
  '980803': {
    cat: 'cooler',
    url: 'https://cdn.shopify.com/s/files/1/0591/4220/9629/products/Aio120-1-600x600_result.jpg?v=1711699538'
  },

  // === CASE_FAN (4) ===
  '980804': {
    cat: 'case_fan',
    url: 'https://m.media-amazon.com/images/I/61kBmC8NfGL._SL1000_.jpg'
  },
  '940104': {
    cat: 'case_fan',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/cooler/y/i/x/zeb-fc430a-single-tower-cooler-4-pin-pwm-fan-120mm-rgb-fan-4-original-imah7gwmqh8yumh7.jpeg'
  },
  '930101': {
    cat: 'case_fan',
    url: 'https://m.media-amazon.com/images/I/41ZJUwPMZWL._SL1000_.jpg'
  },
  '930102': {
    cat: 'case_fan',
    url: 'https://m.media-amazon.com/images/I/51E8EKsttwL._SL1000_.jpg'
  },

  // === MONITOR (4) ===
  '980901': {
    cat: 'monitor',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/products/1_f689f514-8d8c-4bc9-ab9f-b1b4949d227a.webp?v=1757325899'
  },
  '980902': {
    cat: 'monitor',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/files/LM22WHD.jpg?v=1783938972'
  },
  '980903': {
    cat: 'monitor',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/files/1_a5276d77-f71d-44a7-8f62-df5eed24b0de.webp?v=1767690133'
  },
  '980904': {
    cat: 'monitor',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/files/1_bb6c5412-09f0-47b8-b337-118845fac152.webp?v=1757326122'
  },

  // === CASE (7) ===
  '7684426334301': {
    cat: 'case',
    url: 'http://antesports.com/cdn/shop/files/01_B.png?v=1788782000'
  },
  '980601': {
    cat: 'case',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/cabinet/l/h/q/lgt-402-lapcare-original-imahyq7zkkdkvhhp.jpeg'
  },
  '980602': {
    cat: 'case',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/cabinet/j/d/d/lox-235-lapcare-original-imahrq8gtynbyynj.jpeg'
  },
  '980603': {
    cat: 'case',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/files/1_f3df3017-7e63-4fe3-8178-772bb12f6993.jpg?v=1763616398'
  },
  '980604': {
    cat: 'case',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/xif0q/cabinet/g/8/5/lgt-201-gaming-w-o-smps-lapcare-original-imahydf6d2gzrgbz.jpeg'
  },
  '970501': {
    cat: 'case',
    url: 'https://cdn.shopify.com/s/files/1/0893/4165/7458/files/tittanblkedmcopy_jpg.jpg?v=1782984662'
  },
  '960101': {
    cat: 'case',
    url: 'https://images.jdmagicbox.com/quickquotes/images_main/iball_baby_315_computer_cabinet_black_red_11166484_0.jpg'
  },

  // === GAMING_HEADSET (1) ===
  '981005': {
    cat: 'gaming_headset',
    url: 'https://m.media-amazon.com/images/I/6191Ief3i1L._SL1000_.jpg'
  },

  // === GAMING_MOUSEPAD (1) ===
  '981007': {
    cat: 'gaming_mousepad',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/files/1_7da3c7d6-4a91-481b-a163-8a2b01ce51ca.webp?v=1781377693'
  },

  // === WEBCAM (2) ===
  '981006': {
    cat: 'webcam',
    url: 'https://cdn.shopify.com/s/files/1/0735/5052/8804/files/1_4bb94cab-942e-45c9-8879-a5bc8b2ed912.webp?v=1777102488'
  },
  '960105': {
    cat: 'webcam',
    url: 'https://rukminim2.flixcart.com/image/1024/1024/webcam/a/y/k/iball-face2face-c12-0-original-imadc864rbxa5th2.jpeg'
  }
};

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (res.status !== 200) {
      console.error(`HTTP ${res.status} for ${url}`);
      return false;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 2000) {
      console.error(`Buffer too small (${buf.length} bytes) for ${url}`);
      return false;
    }
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, buf);
    return true;
  } catch (e) {
    console.error(`Error downloading ${url}: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log(`Starting download for ${Object.keys(MASTER_MAPPING).length} products...`);
  const productsJsonPath = 'client/public/data/products.json';
  const catalog = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));

  // Remove the miscategorized microphone from case
  if (catalog.case) {
    catalog.case = catalog.case.filter(p => p.id !== 'case_7817367093341');
  }

  let successCount = 0;
  let failCount = 0;

  for (const [id, info] of Object.entries(MASTER_MAPPING)) {
    const ext = info.url.includes('.png') ? 'png' : (info.url.includes('.webp') ? 'webp' : 'jpg');
    const localRelPath = `/images/products/${info.cat}/${id}.${ext}`;
    const destPath = path.join('client/public', localRelPath);

    // Check if file already downloaded and valid
    let exists = false;
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 2000) exists = true;
    }

    if (!exists) {
      const ok = await downloadImage(info.url, destPath);
      if (ok) {
        successCount++;
        console.log(`[DOWNLOADED] ${id} -> ${localRelPath}`);
      } else {
        failCount++;
        console.error(`[FAILED] ${id} -> ${info.url}`);
        continue;
      }
    } else {
      successCount++;
    }

    // Update product in catalog
    const categoryList = catalog[info.cat];
    if (categoryList) {
      const item = categoryList.find(p => String(p.id) === String(id));
      if (item) {
        item.image = localRelPath;
        item.cdn_image = localRelPath;
        item.images = [localRelPath];
      } else {
        console.warn(`Product ${id} not found in catalog.${info.cat}`);
      }
    } else {
      console.warn(`Category ${info.cat} not found in catalog`);
    }
  }

  console.log(`\nDownload summary: ${successCount} successful, ${failCount} failed.`);
  fs.writeFileSync(productsJsonPath, JSON.stringify(catalog, null, 2));
  console.log(`Updated ${productsJsonPath}!`);

  // Run catalog split
  console.log('Regenerating per-category catalog files...');
  execSync('node client/scripts/split_catalog.cjs', { stdio: 'inherit' });
  console.log('Catalog split complete!');
}

main();
