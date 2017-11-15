
'use strict';
module.exports = function printInventory(inputs) {
    let barcode = get_barcode_list(inputs);
    let shopping_cart = get_shopping_cart(barcode);
    let lists = get_shopping_lists(shopping_cart);
    console.log(lists);
}
//获取条形码
function get_barcode_list(inputs) {
    var barcodes={};
    inputs.forEach(function(input){
        if(barcodes[input]||input.indexOf('-')!=-1){
            barcodes[input]++;
            barcodes[input.substr(0,input.indexOf('-'))]=parseInt(input.substr(input.indexOf('-')+1,input.length));
        } else {
            barcodes[input]=1;
        }
    });
    return barcodes

}

//获取购物车
function get_shopping_cart(barcode) {
    let items = loadAllItems();
    let promotions = loadPromotions()[0].barcodes;
    let shopping_cart = [];
    items.forEach((val) => {
        if (barcode[val.barcode]) {
            val.count = barcode[val.barcode];
            promotions.forEach((promotion)=>{
                if (barcode[promotion]) {
                    val.free = Math.floor(val.count / 3);
                }
            })
            shopping_cart.push(val);
        }
    })
    return shopping_cart;
}

//获取购物清单
function get_shopping_lists(shopping_cart) {
    let list = '***<没钱赚商店>购物清单***';
    let list_free = '----------------------' + '\n' + '挥泪赠送商品：';
    let sum = 0;
    let save = 0;
    shopping_cart.forEach((val) => {
        let subtotal = (val.count - val.free) * val.price;
        list += '\n' + '名称：' + val.name + '，数量：' + val.count + val.unit + '，单价：' + val.price.toFixed(2) + '(元)，小计：' + subtotal.toFixed(2) + '(元)';
        sum += subtotal;
        if (val.free > 0) {
            list_free += '\n' + '名称：' + val.name + '，数量：' + val.free + val.unit;
            save += val.free * val.price;
        }

    })
    list = list + '\n' + list_free + '\n' + '----------------------' + '\n' + '总计：' + sum.toFixed(2) + '(元)' + '\n' + '节省：' + save.toFixed(2) + '(元)' + '\n' + '**********************';
    return list;
}

//datbase.js中的获取所有商品和获取优惠活动的两个函数
function loadAllItems() {
    return [
        {
            barcode: 'ITEM000000',
            name: '可口可乐',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000002',
            name: '苹果',
            unit: '斤',
            price: 5.50
        },
        {
            barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00
        },
        {
            barcode: 'ITEM000004',
            name: '电池',
            unit: '个',
            price: 2.00
        },
        {
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50
        }
    ];
}

function loadPromotions() {
    return [
        {
            type: 'BUY_TWO_GET_ONE_FREE',
            barcodes: [
                'ITEM000000',
                'ITEM000001',
                'ITEM000005'
            ]
        }
    ];
}