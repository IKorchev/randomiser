let fragrances =[
    {name: "Creed Aventus",img:"https://johnlewis.scene7.com/is/image/JohnLewis/23682250$rsp-pdp-port-1080$"},
    {name: "Dior Sauvage",img:"https://media.debenhams.com/i/debenhams/123455000399sauvage_eau_de_toilette.jpg?w=1500&h=1500&fmt=webp&qlt=60"},
    {name: "Invictus Aqua", img:"https://fimgs.net/mdimg/perfume/375x500.34506.jpg"}, 
    {name: "A&F First Instinct", img:"https://fimgs.net/mdimg/perfume/375x500.37753.jpg"},
    {name: "Spicebomb Extreme",img: "https://cdn.parfumdreams.de/Img/Art/7/Viktor-Rolf-Spicebomb-Extreme-Eau-de-Parfum-Spray-51397.jpg"},
    {name: "D&G The One", img: "https://www.fragrancedirect.co.uk/dw/image/v2/BBNB_PRD/on/demandware.static/-/Sites-fragrance-master-catalog/default/dw0e06dd85/images/large/Dolce-and-Gabbana-The-One-For-Men-EDP-Spray-50ml-0063776-1.jpg?sw=545&sh=545&sm=fit"},
    {name: "La Yukawam", img: "https://pimages.parfumo.de/720/22425_img-5926-rasasi-la_yuqawam_pour_homme_720.jpg"},
    {name: "Prada l'homme", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQkP73puSDh_tDFvavca0BhwzE9pVu-E-Xu0fJO6sfi2ilPPWoO&usqp=CAU"},
    {name:"La Nuit De l'homme", img: "https://johnlewis.scene7.com/is/image/JohnLewis/236497096?$rsp-pdp-port-1080$"},
    {name: "CH Men Prive", img:"https://cdn.shopify.com/s/files/1/1027/2809/products/CH-Men-Prive_bottle_300x300.png?v=1537446572"},
    {name:"JV Artisan Pure", img: "https://cdn.notinoimg.com/detail_thumb/john-varvatos/719346646581_01-o/john-varvatos-artisan-pure-eau-de-toilette-for-men_.jpg"},
    {name: "Armani Code Profumo", img: "https://www.fragrancedirect.co.uk/dw/image/v2/BBNB_PRD/on/demandware.static/-/Sites-fragrance-master-catalog/default/dw9f1e9d21/images/large/Giorgio-Armani-Code-Profumo-Eau-de-Parfum-Spray-110ml-0069626.jpg?sw=340&sh=340&sm=fit"},
    {name: "1 Million", img: "https://fimgs.net/mdimg/perfume/375x500.3747.jpg"},
    {name: "CK One Summer", img: "https://fimgs.net/mdimg/perfume/375x500.35568.jpg"},
    {name: "Ultra Male", img: "https://www.fragrancedirect.co.uk/dw/image/v2/BBNB_PRD/on/demandware.static/-/Sites-fragrance-master-catalog/default/dw0f2fa83f/images/large/Jean-Paul-Gaultier-Ultra-Male-EDT-Spray-75ml-0062031.jpg?sw=545&sh=545&sm=fit"},
    {name: "Chanel Bleu", img: "https://fimgs.net/mdimg/perfume/375x500.25967.jpg"}, 
    {name:"Chanel AHSEE", img: "https://fimgs.net/mdimg/perfume/375x500.14669.jpg"},
    {name: "Supernova", img: "https://pimages.parfumo.de/social/105033_img-3244-dua_fragrances-supernova_social.jpg"},
    {name: "Burberry London", img: "https://www.fragrancedirect.co.uk/dw/image/v2/BBNB_PRD/on/demandware.static/-/Sites-fragrance-master-catalog/default/dw63c7c134/images/large/0009099.jpg?sw=340&sh=340&sm=fit"},
    {name: "Creed Virgin Island Water", img: "https://pimages.parfumo.de/480/1843_img-3032-creed-virgin_island_water_480.jpg"},
    {name: "PV Vanilla Intense", img: "https://fimgs.net/mdimg/perfume/375x500.45249.jpg"},
    {name: "PV EDL Matin", img: "https://fimgs.net/mdimg/perfume/375x500.52039.jpg"}, 
    {name: "PV King Intense", img: "https://fimgs.net/mdimg/perfume/375x500.50687.jpg"},
    {name: "Baccarat Rouge 540", img: "https://m.hng.io/catalog/product/5/7/576195_1_1.jpg?io=PDP"},
    {name: "Mancera Soleil d'Italie", img: "https://fimgs.net/mdimg/perfume/375x500.54058.jpg"},
    {name: "Byredo Pulp", img:"https://cdn.notinoimg.com/detail_thumb/byredo/byrpulu_aedp10_03/byredo-pulp-eau-de-parfum-unisex___18.jpg"},
    {name: "Sample", img: "https://s3-eu-west-1.amazonaws.com/yi-files/content/2018/01/5a5be0fc9e68a.jpg"}];



//  SELECTORS
const output = document.querySelector('.output')
const perfumes = document.querySelector('.perfumes')
const alert1 = document.querySelector('.alert')
const box = document.querySelector('.box')
const submitBtn = document.querySelector('.submit')
const pickBtn = document.querySelector('.btn')
const form1 = document.querySelector('.form1')
const image1 = document.querySelector('.image1')


// for(let i=0;i<fragrances.length;i++){
//     // console.log(fragrances[i].name)
//     perfumes.innerText = perfumes.innerText + ` ${fragrances[i].name},`
// }



for (let i=0;i<fragrances.length; i++) {
    perfumes.innerText = perfumes.innerText + ` ${fragrances[i].name} ,`
}


pickBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let randomFrag = fragrances[Math.floor(Math.random() * fragrances.length)]
    output.innerText = randomFrag.name
    image1.src = randomFrag.img
})

submitBtn.addEventListener('click', e => {
    e.preventDefault()
    if(box.value !== '' && box.value !== ' ') {
        fragrances.push({
            name: box.value,
            img: "https://media.istockphoto.com/vectors/no-image-available-sign-vector-id922962354?k=6&m=922962354&s=612x612&w=0&h=_KKNzEwxMkutv-DtQ4f54yA5nc39Ojb_KPvoV__aHyU="
        })
        console.log(fragrances)
        perfumes.innerText += ` ${box.value} ,`
        form1.reset()
    } else {
       
        alert1.classList.replace('invisible', 'visible')
        setTimeout(() => {
            alert1.classList.replace('visible', 'invisible')
        }, 5000);
    }
})