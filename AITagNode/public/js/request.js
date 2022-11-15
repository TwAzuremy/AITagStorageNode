const url = 'http://localhost:8081';

/**
 * request data and updating pages
 * @param {*} table 
 */
function update_data(table) {
    axios({
        url: `${url}/getData?table=${table}`,
        method: 'POST'
    }).then((res) => {
        storage_card.classList.remove('animation');

        function load() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (res.data.length === 0) {
                        storage_container.innerHTML = TEMPLATES.EMPTY_IMG;
                        return;
                    }

                    loading_data(res.data, table);
                    resolve(0);
                }, 400);
            });
        }

        function start_animation() {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    start_storgeCard_animation();
                }, 100);
            });
        }

        load().then(() => { start_animation() });
    }).catch(err => {
        create_popup(`${SVG.RE} 请求失败`, COLOR.ERROR);
        storage_container.innerHTML = TEMPLATES.EMPTY_IMG;
        console.error(err);
    })
}

/**
 * add a tag. if the data category added is the current page, refresh the page.
 * @param {JSON} data 
 */
function add_tag(data) {
    if ((data.table).trim() === FINAL.EMPTY
        || (data.title).trim() === FINAL.EMPTY
        || ((data.front).trim() === FINAL.EMPTY && (data.reverse).trim() === FINAL.EMPTY)) {
        return;
    }

    axios({
        url: `${url}/addTag?table=${data.table}&title=${data.title}&front=${data.front}&reverse=${data.reverse}&remark=${data.remark}`,
        method: 'POST'
    }).then((res) => {
        create_popup(`${SVG.OK} 添加成功`, COLOR.SUCCESS);
        if (data.table === view_category) {
            update_data(data.table);
        }
    }).catch(err => {
        create_popup(`${SVG.RE} 添加失败`, COLOR.ERROR);
        console.error(err);
    })
}

/**
 * delete a tag. if the data category added is the current page, refresh the page.
 * @param {String} table 
 * @param {String} id 
 */
function del_tag(table, id) {
    if (table.trim() === FINAL.EMPTY || id.trim() === FINAL.EMPTY) {
        return;
    }

    axios({
        url: `${url}/delTag?table=${table}&id=${id}`,
        method: 'POST'
    }).then((res) => {
        create_popup(`${SVG.OK} 删除成功`, COLOR.SUCCESS);
        if (table === view_category) {
            update_data(table);
        }
    }).catch(err => {
        create_popup(`${SVG.RE} 删除失败`, COLOR.ERROR);
        console.error(err);
    })
}

/**
 * search for `title` or `tags` with tag
 * @param {String} fuzzy 
 * @param {String} mode 
 */
function fuzzy_search(fuzzy, mode = SEARCH_MODE.TITLE) {
    axios({
        url: `${url}/fuzzySearch?fuzzy=${fuzzy}&mode=${mode.toLowerCase()}`,
        method: 'POST'
    }).then((res) => {
        if (Object.keys(res.data).length === 0) {
            search_result.innerHTML = TEMPLATES.EMPTY_IMG;
            return;
        }

        add_search_result(res.data);
    }).catch(err => {
        create_popup(`${SVG.RE} 搜索失败`, COLOR.ERROR);
        search_result.innerHTML = TEMPLATES.EMPTY_IMG;
        console.error(err);
    })
}

/**
 * bulk add data
 * @param {JSON} data 
 */
function bulkAdd(data) {
    if (Object.keys(data).length === 0) {
        return;
    }

    axios({
        url: `${url}/bulkAdd`,
        method: 'POST',
        params: {
            'data': JSON.stringify(data)
        }
    }).then((res) => {
        create_popup(`${SVG.OK} 成功插入 ${res.data} 条`, COLOR.SUCCESS);
    }).catch(err => {
        create_popup(`${SVG.RE} 添加失败`, COLOR.ERROR);
        console.error(err);
    })
}