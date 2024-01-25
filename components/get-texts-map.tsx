import getCurrentDomain from '../components/get-current-domain';

export default function GetTextsMap(keyValuePairs) {
    const domain = getCurrentDomain();

    return keyValuePairs[domain] || keyValuePairs.default;
}