export default function getCurrentDomain() {
    return typeof window !== 'undefined' ? window.location.hostname : null;
};