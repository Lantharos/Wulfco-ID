const products = [
  { name: "HYPER BASIC", shortCode: "HYBA" },
  { name: "HYPER", shortCode: "HYPE" },
  { name: "SPECIAL EDITION", shortCode: "SPED" },
  // Add more products and their short codes here
];

function getWord(productName) {
  return products.find((product) => product.name === productName).shortCode
}

function isValidGiftCode(code, product) {
  const expectedPattern = `WULF-${getWord(product)}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}`;
  const pattern = new RegExp(`^${expectedPattern}$`);
  return pattern.test(code);
}

function getProductFromCode(code) {
  const productCode = code.split("-")[1];
  const matchingProduct = products.find((product) => product.shortCode === productCode);
  return matchingProduct ? matchingProduct.name : null;
}

function validateAndRetrieveProduct(code) {
  const isValid = isValidGiftCode(code, getProductFromCode(code));
  const product = isValid ? getProductFromCode(code) : null;
  return { isValid, product };
}

function generateGiftCode(product) {
  const pattern = `WULF-${getWord(product)}-XXXX-XXXX-XXXX`
  const code = pattern.replace(/X/g, () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return characters.charAt(Math.floor(Math.random() * characters.length));
  });
  return code;
}

const code = generateGiftCode("HYPER")

console.log(code)
console.log(validateAndRetrieveProduct(code))

