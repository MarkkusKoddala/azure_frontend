// Funktsioon POST-päringu tegemiseks ja JSON-vormingus andmete saatmiseks
async function postFormDataAsJson({ url, formData }) {
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);
    console.log(formDataJsonString)
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: formDataJsonString,
    };
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
    return response.json();
}

// Funktsioon GET-päringu tegemiseks
async function getDataAsJson(url) {
    const response = await fetch(url, { method: "GET", headers: { "Accept": "application/json" } });
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
    return response.json();
}

// Funktsioon DELETE-päringu tegemiseks
async function deleteObject(url) {
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
    listiraamatud(); // Uuenda raamatute nimekirja pärast kustutamist
}

// Funktsioon vormi esitamise käsitlemiseks
async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const url = form.action;
    try {
        const formData = new FormData(form);
        console.log(form, url)
        const responseData = await postFormDataAsJson({ url, formData });
        handleResponse(form, responseData);
    } catch (error) {
        console.error(error);
    }
}

// Funktsioon serveri vastuse käsitlemiseks
function handleResponse(form, responseData) {
    const resultElement = document.getElementById("tulemus");
    console.log(responseData)
    if (form.id === "frontform") {
        resultElement.innerHTML = responseData.tulemus;
        listiraamatud();
    } else if (form.id === "otsinguform") {
        let resultHTML = "";
        responseData.tulemused.forEach((tulemus) => {
            resultHTML += `Raamatust ${tulemus.raamatu_id.replace(".txt", "")} leiti sõne '${responseData.sone}' ${tulemus.leitud} korda!<br>`;
        });
        resultElement.innerHTML = resultHTML;
    }
}

// Funktsioon raamatute nimekirja uuendamiseks
async function listiraamatud() {
    const responseData = await getDataAsJson("https://hs9-flask-api-raamatud.azurewebsites.net/raamatud");
    console.log(responseData)
    const resultElement = document.getElementById("raamatud_result");
    resultElement.innerHTML = "";
    for (let raamat of responseData) {
        let raamatNimi = raamat.split('.')[0];
        resultElement.innerHTML += `<a href="https://hs9-flask-api-raamatud.azurewebsites.net/raamatud/${raamatNimi}" download="${raamatNimi}">${raamat}</a> <a href="#" onclick="deleteObject('https://hs9-flask-api-raamatud.azurewebsites.net/raamatud/${raamatNimi}')">[kustuta]</a><br />`;
    }
}
