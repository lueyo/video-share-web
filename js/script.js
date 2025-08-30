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

        // Manejar URLs con parámetros de consulta
        if (extractedUrl.includes('?')) {
            extractedUrl = extractedUrl.split('?')[0];
        }

        // Normalizar: quitar www. si está presente y manejar subdominios
        extractedUrl = extractedUrl.replace('://www.', '://');
        extractedUrl = extractedUrl.replace('://m.', '://'); // Manejar m. para móvil

        const parsedUrl = new URL(extractedUrl);
        const hostname = parsedUrl.hostname.toLowerCase();
        let path = parsedUrl.pathname;

        // Eliminar barra diagonal final si existe
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        // Facebook URL handling - incluir m.facebook.com y www.facebook.com
        if (hostname.includes('facebook.com')) {
            // /videos/{id}
            let match = path.match(/\/videos\/(\d+)/);
            if (match) {
                return 'https://ttk.lueyo.es/f/' + match[1];
            }
            /// share/v/{id}
            // https://www.facebook.com/share/v/1AsA8CNjjA/ -> https://ttk.lueyo.es/f/1AsA8CNjjA
            match = path.match(/\/share\/.\/(\w+)/);
            if (match) {
                return 'https://ttk.lueyo.es/f/' + match[1];
            }

            // /share/{id}
            match = path.match(/\/share\/([A-Za-z0-9]+)/);
            if (match) {
                return 'https://ttk.lueyo.es/f/' + match[1];
            }
            // /reel/{id}
            match = path.match(/\/reel\/(\d+)/);
            if (match) {
                return 'https://ttk.lueyo.es/f/' + match[1];
            }
            // /watch/{id}
            match = path.match(/\/watch\/(\d+)/);
            if (match) {
                return 'https://ttk.lueyo.es/f/' + match[1];
            }
        }

        // TikTok URL handling - incluir variaciones
        if (hostname === 'vm.tiktok.com' || hostname === 'vt.tiktok.com') {
            let videoId = path.replace('/', '');
            if (videoId) {
                return 'https://ttk.lueyo.es/t/' + videoId;
            }
        } else if (hostname.includes('tiktok.com')) {
            // Manejar URLs completas de TikTok
            const match = path.match(/\/(@[^\/]+)\/video\/(\d+)/);
            if (match) {
                
                const videoId = match[2];
                return 'https://ttk.lueyo.es/l/' + videoId;
            }
        }

        // Instagram URL handling - incluir variaciones
        else if (hostname.includes('instagram.com')) {
            const pathParts = path.split('/').filter(Boolean);

            // Posts normales /p/{code}/
            if (pathParts[0] === 'p' && pathParts.length >= 2) {
                const code = pathParts[1];
                return 'https://ttk.lueyo.es/i/' + code;
            }

            // Reels /reel/{code}/
            if (pathParts[0] === 'reel' && pathParts.length >= 2) {
                const code = pathParts[1];
                return 'https://ttk.lueyo.es/i/' + code;
            }

            // Stories /stories/{username}/{code}/
            if (pathParts[0] === 'stories' && pathParts.length >= 3) {
                const code = pathParts[2];
                return 'https://ttk.lueyo.es/i/' + code;
            }
        }

        // X y Twitter URL handling - incluir variaciones
        else if (hostname === 'x.com' || hostname === 'twitter.com' || hostname === 'mobile.twitter.com') {
            const pathParts = path.split('/').filter(Boolean);

            // Status URLs /username/status/{id}
            if (pathParts.length >= 3 && pathParts[1] === 'status') {
                const id = pathParts[2];
                // Validar que sea numérico
                if (/^\d+$/.test(id)) {
                    return 'https://ttk.lueyo.es/x/' + id;
                }
            }

            // Status URLs con nombre de usuario después
            if (pathParts.length >= 4 && pathParts[2] === 'status') {
                const id = pathParts[3];
                if (/^\d+$/.test(id)) {
                    return 'https://ttk.lueyo.es/x/' + id;
                }
            }
        }

        return null;
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

// ping https://tk.lueyo.es/ping

fetch('https://tk.lueyo.es/ping')