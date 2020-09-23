function createRegionMenu() {
    let regions = [];
    let c_data;
    if (saveTableAndCard[0].id == 'client') {
        c_data = client_all_data
    } else if (saveTableAndCard[0].id == 'provider') {
        c_data = provider_all_data
    } else if (saveTableAndCard[0].id == 'provider') {
        c_data = carrier_all_data
    }
    let data = c_data.length > 0 ? c_data : saveTableAndCard[1][1];
    console.log(c_data.length);

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
                if (regions[k].areas[i] == regions[k].areas[j]) {
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

        regions[i].areas.sort((a, b) => {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        })

        for (let j = 0; j < regions[i].areas.length; j++) {
            let liElement = `<li onclick="searchFill(this)">${regions[i].areas[j]}</li>`;
            liList = liList.concat(liElement);
        }
        return liList;
    }

    regions.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
    })

    for (let i = 0; i < regions.length; i++) {
        $(element).append(() => {
            return `
                <div class="region">
                    <div class="region_name" style="display: flex; position: relative">
                        <span onclick="searchRegionFill(this)">${regions[i].name}</span>
                        <div onclick="showRegionList(this)" style="position: absolute; top: 6px; right: 0px; width: 25px; display: flex; justify-content: center; align-items: center; height: 25px; cursor: pointer;">
                            <img style="width: 12px; transform: rotate(90deg); transition: 0.3s all" src="static/images/dropmenu_black.svg">
                        </div>
                    </div>
                    <ul class="list_regions d_none">
                        ${createLiList(i)}
                    </ul>
                </div>
            `
        })
    }

    $('.infoblock:first-child').append(element);
}