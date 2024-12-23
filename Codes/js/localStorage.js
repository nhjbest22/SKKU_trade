const setData = (key, data) => {
    const rawData = localStorage.getItem(key);
    let existingData = rawData ? JSON.parse(rawData) : [];

    const index = existingData.findIndex(
        (item) => item.username === data.username
    );
    if (index !== -1) {
        // 이미 존재하면 데이터 수정
        existingData[index] = data;
    } else {
        // 존재하지 않으면 새로 추가
        existingData.push(data);
    }

    localStorage.setItem(key, JSON.stringify(existingData));
};

const findData = (key, username) => {
    const rawData = localStorage.getItem(key);
    const data = rawData ? JSON.parse(rawData) : [];

    for (const item of data) {
        if (item.username === username) {
            return item;
        }
    }
    return null;
};

const pushData = (key, data) => {
    const rawData = localStorage.getItem(key);
    let existingData = rawData ? JSON.parse(rawData) : [];

    existingData.push(data);
    localStorage.setItem(key, JSON.stringify(existingData));
};

const showAllData = (key) => {
    const rawData = localStorage.getItem(key);
    const existingData = rawData ? JSON.parse(rawData) : [];
    for (const item of existingData) {
        console.log(item);
    }
};
