// script.js
// Toutes les fonctionnalités seront ajoutées ici

document.addEventListener('DOMContentLoaded', function() {
    // Overlay d'accueil animé
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = '<span>Bienvenue sur Exotic Garage Local 🚗</span>';
    document.body.appendChild(overlay);
    overlay.style.display = 'flex';
    setTimeout(() => { overlay.style.opacity = '0'; }, 1200);
    setTimeout(() => { overlay.style.display = 'none'; }, 1800);

    // --- Gestion des véhicules ---
    const vehiculeForm = document.getElementById('vehicule-form');
    const vehiculesList = document.getElementById('vehicules-list');
    const STORAGE_KEY = 'exoticGarageVehicules';

    function loadVehicules() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    function saveVehicules(vehicules) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicules));
    }

    // --- Ajout : Animation d'apparition sur les cartes véhicules ---
    function animateVehiculeCards() {
        const cards = document.querySelectorAll('.vehicule-card');
        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s, transform 0.5s';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 80 * i + 200);
        });
    }

    function renderVehicules() {
        const vehicules = loadVehicules();
        if (vehicules.length === 0) {
            vehiculesList.innerHTML = '<em>Aucun véhicule enregistré.</em>';
            return;
        }
        vehiculesList.innerHTML = vehicules.map((v, idx) => `
            <div class="vehicule-card">
                <strong>${v.plaque}</strong> - ${v.modele}<br>
                Client : ${v.client}<br>
                Travaux : ${v.travaux}<br>
                Prix : <b>${v.prix} €</b>
                <button data-idx="${idx}" class="delete-vehicule">Supprimer</button>
            </div>
        `).join('');
        animateVehiculeCards();
    }

    // --- Ajout : Notifications visuelles RP (toast) ---
    function showToast(msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'rp-toast ' + type;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '1'; }, 50);
        setTimeout(() => { toast.style.opacity = '0'; }, 2200);
        setTimeout(() => { document.body.removeChild(toast); }, 2600);
    }
    // Exemples d'intégration :
    // showToast('Véhicule ajouté !', 'success');
    // showToast('Stock mis à jour', 'info');
    // showToast('Suppression effectuée', 'danger');

    // Intégration sur actions principales :
    const origVehiculeFormSubmit = vehiculeForm.onsubmit || function(){};
    vehiculeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const vehicules = loadVehicules();
        const newVehicule = {
            plaque: document.getElementById('vehicule-plaque').value.trim(),
            modele: document.getElementById('vehicule-modele').value.trim(),
            client: document.getElementById('vehicule-client').value.trim(),
            travaux: document.getElementById('vehicule-travaux').value.trim(),
            prix: parseInt(document.getElementById('vehicule-prix').value, 10)
        };
        vehicules.push(newVehicule);
        saveVehicules(vehicules);
        vehiculeForm.reset();
        renderVehicules();
        showToast('Véhicule ajouté !', 'success');
    });

    vehiculesList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-vehicule')) {
            const idx = parseInt(e.target.getAttribute('data-idx'), 10);
            const vehicules = loadVehicules();
            vehicules.splice(idx, 1);
            saveVehicules(vehicules);
            renderVehicules();
            showToast('Véhicule supprimé', 'danger');
        }
    });

    // --- Ajout : Mode nuit automatique (Dark Mode) ---
    function setDarkMode(active) {
        if (active) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('exoticGarageDarkMode', '1');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('exoticGarageDarkMode', '0');
        }
    }
    // Ajout d'un bouton flottant pour le mode nuit
    const darkBtn = document.createElement('button');
    darkBtn.innerHTML = '🌙';
    darkBtn.title = 'Activer/Désactiver le mode nuit';
    darkBtn.style.position = 'fixed';
    darkBtn.style.bottom = '28px';
    darkBtn.style.right = '32px';
    darkBtn.style.zIndex = '1200';
    darkBtn.style.fontSize = '1.6rem';
    darkBtn.style.background = '#232526';
    darkBtn.style.color = '#fff';
    darkBtn.style.border = 'none';
    darkBtn.style.borderRadius = '50%';
    darkBtn.style.width = '48px';
    darkBtn.style.height = '48px';
    darkBtn.style.boxShadow = '0 2px 8px #0005';
    darkBtn.style.cursor = 'pointer';
    darkBtn.style.transition = 'background 0.2s, transform 0.1s';
    darkBtn.onmouseenter = () => darkBtn.style.background = '#27ae60';
    darkBtn.onmouseleave = () => darkBtn.style.background = '#232526';
    document.body.appendChild(darkBtn);
    // Initialisation selon préférence
    const darkPref = localStorage.getItem('exoticGarageDarkMode') === '1';
    setDarkMode(darkPref);
    darkBtn.onclick = () => setDarkMode(!document.body.classList.contains('dark-mode'));

    // --- Gestion du stock de pièces ---
    const pieceForm = document.getElementById('piece-form');
    const stockList = document.getElementById('stock-list');
    const STOCK_KEY = 'exoticGarageStock';

    function loadStock() {
        const data = localStorage.getItem(STOCK_KEY);
        return data ? JSON.parse(data) : [];
    }
    function saveStock(stock) {
        localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
    }
    function renderStock() {
        const stock = loadStock();
        if (stock.length === 0) {
            stockList.innerHTML = '<em>Aucune pièce en stock.</em>';
            return;
        }
        stockList.innerHTML = stock.map((item, idx) => `
            <div class="stock-card" style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
                <span style="flex:2;"><b>${item.nom}</b></span>
                <span style="flex:1;">x${item.quantite}</span>
                <button class="add-piece" data-idx="${idx}" title="Ajouter">＋</button>
                <button class="remove-piece" data-idx="${idx}" title="Retirer">－</button>
                <button class="delete-piece" data-idx="${idx}" title="Supprimer">🗑️</button>
                <span class="alert" style="margin-left:10px;${item.quantite === 0 ? '' : 'display:none;'}">Rupture !</span>
            </div>
        `).join('');
    }
    pieceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nom = document.getElementById('piece-nom').value.trim();
        const quantite = parseInt(document.getElementById('piece-quantite').value, 10);
        if (!nom) return;
        let stock = loadStock();
        const idx = stock.findIndex(p => p.nom.toLowerCase() === nom.toLowerCase());
        if (idx !== -1) {
            stock[idx].quantite += quantite;
        } else {
            stock.push({ nom, quantite });
        }
        saveStock(stock);
        pieceForm.reset();
        renderStock();
        showToast('Stock mis à jour', 'info');
    });
    stockList.addEventListener('click', function(e) {
        const stock = loadStock();
        if (e.target.classList.contains('add-piece')) {
            const idx = parseInt(e.target.getAttribute('data-idx'), 10);
            stock[idx].quantite++;
            saveStock(stock);
            renderStock();
            showToast('Stock modifié', 'info');
        } else if (e.target.classList.contains('remove-piece')) {
            const idx = parseInt(e.target.getAttribute('data-idx'), 10);
            if (stock[idx].quantite > 0) stock[idx].quantite--;
            saveStock(stock);
            renderStock();
            showToast('Stock modifié', 'info');
        } else if (e.target.classList.contains('delete-piece')) {
            const idx = parseInt(e.target.getAttribute('data-idx'), 10);
            stock.splice(idx, 1);
            saveStock(stock);
            renderStock();
            showToast('Pièce supprimée', 'danger');
        }
    });

    // --- Gestion Facture express RP ---
    const factureForm = document.getElementById('facture-form');
    const factureVehicule = document.getElementById('facture-vehicule');
    const factureTravaux = document.getElementById('facture-travaux');
    const facturePrix = document.getElementById('facture-prix');
    const factureResult = document.getElementById('facture-result');
    const factureText = document.getElementById('facture-text');
    const factureCopy = document.getElementById('facture-copy');

    function updateFactureVehicules() {
        const vehicules = loadVehicules();
        factureVehicule.innerHTML = vehicules.length === 0 ? '<option value="">Aucun véhicule</option>' :
            vehicules.map((v, idx) => `<option value="${idx}">${v.plaque} - ${v.modele} (${v.client})</option>`).join('');
    }
    updateFactureVehicules();
    // Mettre à jour la liste à chaque ajout/suppression de véhicule
    const origRenderVehicules = renderVehicules;
    renderVehicules = function() {
        origRenderVehicules();
        updateFactureVehicules();
    };

    factureForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const vehicules = loadVehicules();
        const idx = factureVehicule.value;
        if (!vehicules[idx]) return;
        const v = vehicules[idx];
        const travaux = factureTravaux.value.trim();
        const prix = facturePrix.value.trim();
        const facture = `--- FACTURE RP ---\nClient : ${v.client}\nVéhicule : ${v.modele} (${v.plaque})\nTravaux : ${travaux}\nPrix total : ${prix} €\nGarage : Exotic Garage Local`;
        factureText.value = facture;
        factureResult.style.display = 'block';
    });
    factureCopy.addEventListener('click', function() {
        factureText.select();
        document.execCommand('copy');
        factureCopy.innerText = 'Copié !';
        setTimeout(() => { factureCopy.innerText = 'Copier la facture'; }, 1200);
    });

    // --- Gestion du staff ---
    const staffForm = document.getElementById('staff-form');
    const staffList = document.getElementById('staff-list');
    const STAFF_KEY = 'exoticGarageStaff';

    function loadStaff() {
        const data = localStorage.getItem(STAFF_KEY);
        return data ? JSON.parse(data) : [];
    }
    function saveStaff(staff) {
        localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
    }
    // --- Ajout : badge de statut en ligne/offline pour chaque employé (staff) ---
    function renderStaff() {
        const staff = loadStaff();
        if (staff.length === 0) {
            staffList.innerHTML = '<em>Aucun employé enregistré.</em>';
            return;
        }
        staffList.innerHTML = staff.map((s, idx) => `
            <div class="staff-card" style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                <span class="staff-badge ${s.present ? 'on' : 'off'}" title="${s.present ? 'En service' : 'Off-duty'}"></span>
                <input type="checkbox" class="staff-presence" data-idx="${idx}" ${s.present ? 'checked' : ''} title="Présence">
                <span style="flex:2;"><b>${s.nom}</b></span>
                <input type="text" class="staff-note" data-idx="${idx}" value="${s.note || ''}" placeholder="Note rapide..." style="flex:3;min-width:120px;">
                <button class="delete-staff" data-idx="${idx}" title="Supprimer">🗑️</button>
            </div>
        `).join('');
    }
    staffForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nom = document.getElementById('staff-nom').value.trim();
        if (!nom) return;
        let staff = loadStaff();
        staff.push({ nom, present: true, note: '' });
        saveStaff(staff);
        staffForm.reset();
        renderStaff();
        showToast('Employé ajouté', 'success');
    });
    staffList.addEventListener('change', function(e) {
        let staff = loadStaff();
        if (e.target.classList.contains('staff-presence')) {
            const idx = parseInt(e.target.getAttribute('data-idx'), 10);
            staff[idx].present = e.target.checked;
            saveStaff(staff);
        } else if (e.target.classList.contains('staff-note')) {
            const idx = parseInt(e.target.getAttribute('data-idx'), 10);
            staff[idx].note = e.target.value;
            saveStaff(staff);
        }
    });
    staffList.addEventListener('click', function(e) {
        let staff = loadStaff();
        if (e.target.classList.contains('delete-staff')) {
            const idx = parseInt(e.target.getAttribute('data-idx'), 10);
            staff.splice(idx, 1);
            saveStaff(staff);
            renderStaff();
            showToast('Employé supprimé', 'danger');
        }
    });
    renderStaff();

    renderVehicules();
    renderStock();

    // --- Export des données ---
    const exportJsonBtn = document.getElementById('export-json');
    const exportTxtBtn = document.getElementById('export-txt');
    const exportSuccess = document.getElementById('export-success');

    function downloadFile(filename, content, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    exportJsonBtn.addEventListener('click', function() {
        const data = {
            vehicules: loadVehicules(),
            stock: loadStock(),
            staff: loadStaff()
        };
        downloadFile('exotic_garage_'+(new Date().toISOString().slice(0,10))+'.json', JSON.stringify(data, null, 2), 'application/json');
        exportSuccess.style.display = 'inline';
        setTimeout(() => exportSuccess.style.display = 'none', 1500);
    });

    exportTxtBtn.addEventListener('click', function() {
        const vehicules = loadVehicules();
        const stock = loadStock();
        const staff = loadStaff();
        let txt = '--- EXPORT RP EXOTIC GARAGE ---\n';
        txt += '\n--- Véhicules ---\n';
        vehicules.forEach(v => {
            txt += `Plaque: ${v.plaque} | Modèle: ${v.modele} | Client: ${v.client} | Travaux: ${v.travaux} | Prix: ${v.prix} €\n`;
        });
        txt += '\n--- Stock de pièces ---\n';
        stock.forEach(p => {
            txt += `${p.nom} : ${p.quantite}\n`;
        });
        txt += '\n--- Staff ---\n';
        staff.forEach(s => {
            txt += `${s.nom} (${s.present ? 'En service' : 'Off-duty'}) - Note: ${s.note || ''}\n`;
        });
        downloadFile('exotic_garage_'+(new Date().toISOString().slice(0,10))+'.txt', txt, 'text/plain');
        exportSuccess.style.display = 'inline';
        setTimeout(() => exportSuccess.style.display = 'none', 1500);
    });

    // --- Ajout : sauvegarde/restauration manuelle des données (import/export JSON) ---
    const importBtn = document.createElement('button');
    importBtn.innerText = 'Importer .json';
    importBtn.id = 'import-json';
    importBtn.style.marginLeft = '12px';
    const exportSection = document.getElementById('export-section');
    if(exportSection) exportSection.appendChild(importBtn);
    importBtn.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const data = JSON.parse(evt.target.result);
                    if(data.vehicules && data.stock && data.staff) {
                        localStorage.setItem('exoticGarageVehicules', JSON.stringify(data.vehicules));
                        localStorage.setItem('exoticGarageStock', JSON.stringify(data.stock));
                        localStorage.setItem('exoticGarageStaff', JSON.stringify(data.staff));
                        showToast('Import réussi !', 'success');
                        location.reload();
                    } else {
                        showToast('Fichier non valide', 'danger');
                    }
                } catch {
                    showToast('Erreur à l\'import', 'danger');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    });

    // --- Ambiance RP : musique de garage ---
    const rpAudio = document.getElementById('rp-audio');
    const rpAudioToggle = document.getElementById('rp-audio-toggle');
    let rpActive = false;
    rpAudioToggle.addEventListener('click', function() {
        if (!rpActive) {
            rpAudio.play();
            rpAudioToggle.innerText = 'Désactiver';
            rpActive = true;
        } else {
            rpAudio.pause();
            rpAudio.currentTime = 0;
            rpAudioToggle.innerText = 'Activer';
            rpActive = false;
        }
    });
    // Pause musique si on quitte la page
    window.addEventListener('beforeunload', () => { rpAudio.pause(); });

    // --- Amélioration accessibilité : navigation clavier & focus visible ---
    // Ajout d'un focus visible personnalisé pour tous les éléments interactifs
    const style = document.createElement('style');
    style.innerHTML = `
        :focus {
            outline: 2.5px solid #27ae60 !important;
            outline-offset: 2px;
            box-shadow: 0 0 0 2px #b2ffb255 !important;
        }
        button:focus, input:focus, select:focus, textarea:focus, a:focus {
            background: #eafaf1 !important;
            color: #232526 !important;
        }
        body.dark-mode :focus {
            outline: 2.5px solid #b2ffb2 !important;
            box-shadow: 0 0 0 2px #27ae6022 !important;
        }
        body.dark-mode button:focus, body.dark-mode input:focus, body.dark-mode select:focus, body.dark-mode textarea:focus, body.dark-mode a:focus {
            background: #232526 !important;
            color: #b2ffb2 !important;
        }
    `;
    document.head.appendChild(style);

    // --- Recherche de véhicules ---
    document.getElementById('search-vehicules').addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const vehicules = loadVehicules();
        const filtered = vehicules.filter(v => v.plaque.toLowerCase().includes(query) || v.modele.toLowerCase().includes(query) || v.client.toLowerCase().includes(query));
        // Mettre à jour l'affichage avec les résultats filtrés
        vehiculesList.innerHTML = filtered.length === 0 ? '<em>Aucun véhicule trouvé.</em>' :
            filtered.map((v, idx) => `
                <div class="vehicule-card">
                    <strong>${v.plaque}</strong> - ${v.modele}<br>
                    Client : ${v.client}<br>
                    Travaux : ${v.travaux}<br>
                    Prix : <b>${v.prix} €</b>
                    <button data-idx="${idx}" class="delete-vehicule">Supprimer</button>
                </div>
            `).join('');
    });

    // --- Sidebar navigation ---
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      document.body.classList.toggle('sidebar-open');
      if (sidebar.classList.contains('open')) {
        sidebarToggle.setAttribute('aria-label', 'Fermer le menu');
        sidebarToggle.innerText = '✕';
        sidebar.querySelector('a').focus();
      } else {
        sidebarToggle.setAttribute('aria-label', 'Ouvrir le menu');
        sidebarToggle.innerText = '☰';
        sidebarToggle.focus();
      }
    });
    // Fermer le menu au clic sur un lien ou touche ESC
    sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
        sidebarToggle.setAttribute('aria-label', 'Ouvrir le menu');
        sidebarToggle.innerText = '☰';
      });
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
        sidebarToggle.setAttribute('aria-label', 'Ouvrir le menu');
        sidebarToggle.innerText = '☰';
        sidebarToggle.focus();
      }
    });

    // --- Ajout : scroll fluide et retour haut de page ---
    // Scroll fluide pour tous les liens internes
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    // Bouton retour haut de page
    const topBtn = document.createElement('button');
    topBtn.id = 'back-to-top';
    topBtn.title = 'Remonter en haut';
    topBtn.innerHTML = '↑';
    topBtn.style.display = 'none';
    document.body.appendChild(topBtn);
    window.addEventListener('scroll', function() {
      topBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
    });
    topBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
