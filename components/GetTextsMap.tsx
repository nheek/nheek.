import getCurrentDomain from './GetCurrentDomain';

export default function GetTextsMap(keyValuePairs) {
    const domain = getCurrentDomain();

    return keyValuePairs[domain] || keyValuePairs.default;
}