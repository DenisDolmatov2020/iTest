async function loadData(updateState) {
    try {
        const dataResponse = await fetch(`/api/component-data`);
        if (dataResponse.ok) {
            const newData = await dataResponse.json();
            Object.entries(newData).forEach(([key, value]) => {
                updateState(key, value);
            });
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export default loadData;