const inputUrl = document.getElementById('inputUrl');
const convertBtn = document.getElementById('convertBtn');
const copyBtn = document.getElementById('copyBtn');
const resultDiv = document.getElementById('result');
const clearInputBtn = document.getElementById('clearInputBtn');

function convertUrl(url) {
    try {
        // Extraer solo la primera URL si hay texto extra
        const urlMatch = url.trim().match(/https?:\/\/[^\s]+/);
        if (!urlMatch) return null;
        let extractedUrl = urlMatch[0];
        // Normalizar: quitar www. si está presente
        extractedUrl = extractedUrl.replace('://www.', '://');
        const parsedUrl = new URL(extractedUrl);
        const path = parsedUrl.pathname;

        // Facebook URL handling
        if (parsedUrl.hostname === 'facebook.com') {
            // /videos/{id}
            let match = path.match(/\/videos\/(\d+)/);
            if (match) {
                return 'https://tk.lueyo.es/f/' + match[1];
            }
            // /share/{id}/
            match = path.match(/\/share\/([A-Za-z0-9]{10})/);
            if (match) {
                return 'https://tk.lueyo.es/f/' + match[1];
            }
            // /reel/{id}
            match = path.match(/\/reel\/(\d+)/);
            if (match) {
                return 'https://tk.lueyo.es/f/' + match[1];
            }
        }
        // TikTok URL handling
        if (parsedUrl.hostname === 'vm.tiktok.com') {
            let path = parsedUrl.pathname;
            if (path.endsWith('/')) {
                path = path.slice(0, -1);
            }
            return 'https://tk.lueyo.es/t' + path;
        } else if (parsedUrl.hostname === 'www.tiktok.com') {
            let path = parsedUrl.pathname;
            if (path.endsWith('/')) {
                path = path.slice(0, -1);
            }
            return 'https://tk.lueyo.es/t' + path;
        }
        // Instagram URL handling
        else if (parsedUrl.hostname === 'www.instagram.com') {
            const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
            // Check if path starts with 'p' or 'reel' and has a code after it
            if ((pathParts[0] === 'p' || pathParts[0] === 'reel') && pathParts.length > 1) {
                const code = pathParts[1];
                return 'https://tk.lueyo.es/i/' + code;
            } else {
                return null;
            }
        }
        // X and Twitter URL handling
        else if (parsedUrl.hostname === 'x.com' || parsedUrl.hostname === 'twitter.com') {
            const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
            // Expecting path like: username/status/id and possibly more
            if (pathParts.length >= 3 && pathParts[1] === 'status') {
                const id = pathParts[2];
                // Validate id is numeric (optional)
                if (/^\d+$/.test(id)) {
                    return 'https://tk.lueyo.es/x/' + id;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
}

convertBtn.addEventListener('click', () => {
    const input = inputUrl.value;
    const converted = convertUrl(input);
    if (converted) {
        resultDiv.textContent = converted;
        resultDiv.classList.remove('hidden');
        copyBtn.classList.remove('hidden');
    } else {
        resultDiv.textContent = 'Introduce un enlace válido de X, TikTok o Instagram.';
        resultDiv.classList.remove('hidden');
        copyBtn.classList.add('hidden');
    }
});

copyBtn.addEventListener('click', () => {
    const text = resultDiv.textContent;
    navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '¡Copiado!';
        setTimeout(() => {
            copyBtn.textContent = 'Copiar enlace';
        }, 2000);
    }).catch(() => {
        alert('No se pudo copiar el enlace. Por favor, cópialo manualmente.');
    });
});

// Mostrar/ocultar el botón de limpiar según el contenido del input
inputUrl.addEventListener('input', () => {
    clearInputBtn.style.display = inputUrl.value ? 'block' : 'none';
});
clearInputBtn.addEventListener('click', (e) => {
    e.preventDefault();
    inputUrl.value = '';
    clearInputBtn.style.display = 'none';
    inputUrl.focus();
});