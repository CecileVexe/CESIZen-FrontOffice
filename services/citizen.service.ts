// async function getData() {
//   const url = "https://example.org/products.json";
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Response status: ${response.status}`);
//     }

//     const json = await response.json();
//     console.log(json);
//   } catch (error) {
//     console.error(error.message);
//   }
// }

// const myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");

// const response = await fetch("https://example.org/post", {
//   method: "POST",
//   headers: myHeaders,
//   body: JSON.stringify({ username: "example" }),
//   // ...
// });

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const createCitizen = async (citizen: any) => {
  try {
    const response = await fetch(`${_URL}citizen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clerkId: citizen }),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
