/**
 * Drop Down и Card меню
 */

function createDropMenu() {
    let element = $('<div />', {
        class: 'item drop_down_search'
    });

    function createLiList(i) {
        let liList = '';

        for (let j = 0; j < regions[i].areas.length; j++) {
            let liElement = `<li>${regions[i].areas[j]}</li>`;
            liList = liList.concat(liElement);
        }
        return liList;
    }

    for (let i = 0; i < regions.length; i++) {
        $(element).append(() => {
            let region = $('<div />', {
                class: 'region',
                append: $('<span>', {
                    class: '',
                    html: regions[i].name
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