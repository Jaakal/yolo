const path = require('path');
const fs = require('fs');

function jsonImporter(url, prev) {
  if (isJsonfile(url)) {
    const jsonPath = path.resolve(path.dirname(prev), url);
    const jsonFile = fs.readFileSync(jsonPath, 'utf8');
    const jsonContent = JSON.parse(jsonFile);
    const jsonAsSass = transformJsonToSass(jsonContent);
    return { contents: jsonAsSass };
  }

  return { file: url };
}

function transformJsonToSass(json) {
  return Object.keys(json)
    .filter((key) => isValidKey(key))
    .filter((key) => json[key] !== '#')
    .map((key) => `$${key}: ${parseValue(json[key])};`)
    .join('\n');
}

function parseValue(value) {
  if (Array.isArray(value)) {
    return parseList(value);
  } else if (isObject(value)) {
    return parseMap(value);
  } else if (value === '') {
    return '""'; // Return explicitly an empty string (Sass would otherwise throw an error as the variable is set to nothing)
  } else {
    return value;
  }
}

function parseList(list) {
  return `(${list.map((value) => parseValue(value)).join(',')})`;
}

function parseMap(map) {
  return `(${Object.keys(map)
    .filter((key) => isValidKey(key))
    .map((key) => `${key}: ${parseValue(map[key])}`)
    .join(',')})`;
}

function isJsonfile(url) {
  return /\.js(on5?)?$/.test(url);
}

function isValidKey(key) {
  return /^[^$@:].*/.test(key);
}

function isObject(value) {
  return value === Object(value);
}

module.exports = { jsonImporter };
