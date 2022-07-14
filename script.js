
for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
    e.style.setProperty('--value', e.value);
    e.style.setProperty('--min', e.min == '' ? '0' : e.min);
    e.style.setProperty('--max', e.max == '' ? '100' : e.max);
    e.addEventListener('input', () => e.style.setProperty('--value', e.value));
}


const fileInput = document.querySelector('.control .file-input')
fileInputBtn = document.querySelector('.control .upload') 
resetBtn = document.querySelector('.control .reset') 
saveBtn = document.querySelector('.control .save') 
previewImg = document.querySelector(".preview-img img")
filterBtn = document.querySelectorAll('.filters button')
rotateBtn = document.querySelectorAll('.rotate button')
filterName = document.querySelector('.slider .name')
filterValue = document.querySelector('.slider .value')
filterSlider = document.querySelector('.slider input')

let Brightness = 100, Saturation = 100, Inversion = 0, 
Grayscale = 0
let rotate = 0, flipHorizontal = 1, flipVertical = 1

filterBtn.forEach(option => {
    option.addEventListener('click', ()=>{
        document.querySelector('.options .active').classList.remove('active')
        option.classList.add('active')
        filterName.innerText = option.innerText
        if (option.id === 'Brightness') {
            filterSlider.max = 200
            filterSlider.value = Brightness
            filterValue.innerText = `${filterSlider.value}%`}
        else if (option.id === 'Saturation') {
            filterSlider.max = 200
            filterSlider.value = Saturation
            filterValue.innerText = `${filterSlider.value}%`}
        else if (option.id === 'Inversion') {
            filterSlider.max = 100
            filterSlider.value = Inversion
            filterValue.innerText = `${filterSlider.value}%`
        }else if (option.id === 'Grayscale') {
            filterSlider.max = 100
            filterSlider.value = Grayscale
            filterValue.innerText = `${filterSlider.value}%`
        }
        for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
            e.style.setProperty('--value', e.value);
            e.style.setProperty('--min', e.min == '' ? '0' : e.min);
            e.style.setProperty('--max', e.max == '' ? '100' : e.max);
            e.addEventListener('input', () => e.style.setProperty('--value', e.value));
        }
    })
});

function applyFilter() {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`
    previewImg.style.filter = `brightness(${Brightness}%) saturate(${Saturation}%)
    invert(${Inversion}%) grayscale(${Grayscale}%)`
}

function loadImage() {
    let file = fileInput.files[0]
    if (!file) { return }
    previewImg.src = URL.createObjectURL(file)
    previewImg.addEventListener('load', () => {
        document.querySelector('.container').classList.remove('disable')
    })
    resetBtn.click()
}

function updateFilter() {
    sliderValue = filterSlider.value
    activeFilter = document.querySelector('.filters .active')
    if (activeFilter.innerText === 'Brightness'){
        Brightness = sliderValue
        filterValue.innerText = `${Brightness}%`
    }
    if (activeFilter.innerText === 'Saturation'){
        Saturation = sliderValue
        filterValue.innerText = `${Saturation}%`
    }
    if (activeFilter.innerText === 'Inversion'){
        Inversion = sliderValue
        filterValue.innerText = `${Inversion}%`
    }
    if (activeFilter.innerText === 'Grayscale'){
        Grayscale = sliderValue
        filterValue.innerText = `${Grayscale}%`
    }
    applyFilter()
}

rotateBtn.forEach(option => {
    option.addEventListener('click', ()=>{
        if(option.id === "left") {
            rotate -= 90
        }
        else if(option.id === "right") {
            rotate += 90
        }
        else if(option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 :1
        }
        else if(option.id === "vertical") {
            flipVertical = flipVertical === 1 ? -1 :1
        }
        applyFilter()
        updateFilter()
    })
});

function resetFilter(){
    Brightness = 100, Saturation = 100, Inversion = 0, 
    Grayscale = 0,
    rotate = 0, flipHorizontal = 1, flipVertical = 1
    applyFilter()
    filterBtn[0].click()
}

function saveImage() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = previewImg.naturalWidth
    canvas.height = previewImg.naturalHeight
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.filter = `brightness(${Brightness}%) saturate(${Saturation}%)
    invert(${Inversion}%) grayscale(${Grayscale}%)`//apply filter value
    ctx.scale(flipHorizontal, flipVertical) //apply horizontal & vertical flip
    if (rotate !== 0) { //apple rotation
        ctx.rotate(rotate * Math.PI / 180)
    }
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
    const link = document.createElement('a')
    link.download = 'image.jpg'
    link.href = canvas.toDataURL()
    link.click()
}

resetBtn.addEventListener('click', resetFilter)
saveBtn.addEventListener('click', saveImage)
fileInputBtn.addEventListener('click', () => fileInput.click())
fileInput.addEventListener("change", loadImage)
filterSlider.addEventListener('input', updateFilter)