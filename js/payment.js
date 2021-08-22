const fetchData = async () => {
	try {
		const resp = await fetch("/states.json")
		const data = await resp.json()
		return data
	} catch (Err) {}
}

fetchData().then((data) => {
	data.map((eachState) => {
		document.querySelector(".input.state").insertAdjacentHTML(
			"beforeend",
			`
            <option class="option">${eachState.state}</option>
        `
		)
	})
})

const changeDistrict = (state) => {
	fetchData().then((data) => {
		const districts = data.filter((eachData) => {
			return eachData.state === state
		})
		document.querySelector(".input.district").innerHTML = ""
		districts[0].districts.map((eachDistrict) => {
			document.querySelector(".input.district").insertAdjacentHTML(
				"beforeend",
				`
                <option class="option">${eachDistrict}</option>
            `
			)
		})
	})
}
const toggleButton = (state) => {
	const button = document.querySelector(".button")
	const spinner = document.querySelector(".spinner")
	if (state == true) {
		spinner.style.display = "none"
		button.style.display = "block"
	} else {
		button.style.display = "none"
		spinner.style.display = "block"
	}
}
const verifyNumber = (number) => {
	return validator.isMobilePhone(number, ["en-IN"])
}
const verifyEmail = (email) => {
	return validator.isEmail(email)
}
const verifyPincode = (code) => {
	return validator.isPostalCode(code, ["IN"])
}
const placeOrder = async () => {
	toggleButton(false)
	const data = {
		name: document.querySelector(".input.name").value,
		phone: document.querySelector(".input.phone").value,
		email: document.querySelector(".input.email").value,
		line1: document.querySelector(".input.line1").value,
		line2: document.querySelector(".input.line2").value,
		state: document.querySelector(".input.state").value,
		district: document.querySelector(".input.district").value,
		city: document.querySelector(".input.city").value,
		pincode: document.querySelector(".input.pincode").value,
	}

	const optionalField = ["line2", "email"]
	for (item in data) {
		if (
			optionalField.includes(item) &&
			(data[item] === "" || data[item] === undefined || data[item] === " ")
		) {
			delete data[item]
			continue
		}
		if (data[item] === "" || data[item] === " " || data[item] === undefined) {
			toggleButton(true)
			alert(`${item} invalid`)
			return
		}
	}
	if (data.state === "State") {
		alert("Please select a state")
		toggleButton(true)
		return
	}
	if (data.state === "District") {
		alert("Please select a district")
		toggleButton(true)
		return
	}
	if (!verifyNumber(data.phone)) {
		alert("Phone Number Invalid")
		toggleButton(true)
		return
	}
	if (data.email && !verifyEmail(data.email)) {
		alert("Email invalid")
		toggleButton(true)
		return
	}
	if (!verifyPincode(data.pincode)) {
		alert("Pincode invalid")
		toggleButton(true)
		return
	}
	const url = `${window.location.origin}/api/order`
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(data),
	})
	const respData = await response.json()
	if (response.status === 201) {
		location.assign(`/checkout/${respData.data._id}`)
	} else {
		alert(`${respData.errorMessage}. Try Again!!`)
		toggleButton(true)
		return
	}
}
