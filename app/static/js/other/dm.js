function createRegionMenu() {
    let regions = [];
    let data = saveTableAndCard[1][1];

    for (let i = 0; i < data.length; i++) {
        if (saveTableAndCard[0].id == 'carrier') {
            if (data[i].Region != null) {
                regions.push({ name: data[i].Region, areas: [] });
            }
        } else {
            if (data[i].Oblast != null) {
                regions.push({ name: data[i].Oblast, areas: [] });
            }
        }
    }

    for (let i = 0; i < regions.length - 1; i++) {
        for (let j = i + 1; j < regions.length; j++) {
            if (regions[i].name == regions[j].name) {
                regions.splice(j, 1);
                j--;
            }
        }
    }

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < regions.length; j++) {
            if (saveTableAndCard[0].id == 'carrier') {
                if (regions[j].name == data[i].Region && data[i].Area != null && data[i].Area != '') {
                    regions[j].areas.push(data[i].Area)
                }
            } else {
                if (regions[j].name == data[i].Oblast && data[i].Rayon != null && data[i].Rayon != '') {
                    regions[j].areas.push(data[i].Rayon)
                }
            }
        }
    } 

    for (let k = 0; k < regions.length; k++) {
        for (let i = 0; i < regions[k].areas.length - 1; i++) {
            for (let j = i + 1; j < regions[k].areas.length; j++) {
                if (regions[k].areas[i].includes(regions[k].areas[j]) || regions[k].areas[j].includes(regions[k].areas[i])) {
                    regions[k].areas.splice(j, 1);
                    j--;
                }
            }
        }
    }

    let element = $('<div />', {
        class: 'item drop_down_search'
    });

    function createLiList(i) {
        let liList = '';

        for (let j = 0; j < regions[i].areas.length; j++) {
            let liElement = `<li onclick="searchFill(this)">${regions[i].areas[j]}</li>`;
            liList = liList.concat(liElement);
        }
        return liList;
    }

    for (let i = 0; i < regions.length; i++) {
        $(element).append(() => {
            let region = $('<div />', {
                class: 'region',
                append: $('<div>', {
                    class: 'region_name',
                    html: regions[i].name,
                    onclick: 'searchRegionFill(this)' // Фильтровать по области
                }).add($('<ul>', {
                    class: 'list_regions',
                    html: createLiList(i)
                }))
            });

            return region;
        })
    }

    $('.infoblock:first-child').append(element);
}