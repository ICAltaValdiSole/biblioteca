$(function() {
    $('.navbar-toggler').on('click', function() {
        $('.tm-header').toggleClass('show');
    });

    $('.tm-nav-link').click(function() {
        $('.tm-nav-link').removeClass('active');
        $(this).addClass('active');
        var filter = $(this).data('filter');
        filterBooks(filter);
    });

    $('html').click(function(event) {
        if (!$(event.target).closest('.tm-header, .navbar-toggler').length) {
            $('.tm-header').removeClass('show');
        }
    });

    caricaLibri();
});

function caricaLibri() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1bHmR_g_8Rp54M1lLnZd3nD78EqRTIKNSzl1mE2-hRzQ/values/libreriaprincipale?key=AIzaSyCBAMHlMKwdPs8hlvRnxxNOWwdXxqnKC3k`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const libri = data.values;
        const tbody = document.querySelector('#libriTable tbody');
        libri.shift(); // remove the header row
        libri.forEach(libro => {
            const [id, titolo, autore, disponibilita, tipo] = libro;
            const disponibilitaClass = disponibilita === 'Disponibile' ? 'disponibile' : 'in-prestito';
            const tr = document.createElement('tr');
            tr.setAttribute('data-type', tipo);
            tr.innerHTML = `
                <td class="id-column">${id}</td>
                <td>${titolo}</td>
                <td>${autore}</td>
                <td class="${disponibilitaClass}">${disponibilita}</td>
                <td>
                    ${disponibilita === 'Disponibile' 
                        ? `<button onclick="prendiInPrestito(${id})"><span>Prendi in prestito</span></button>`
                        : `<button onclick="restituisciLibro(${id})"><span>Restituisci</span></button>`}
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

function filterBooks(filter) {
    var allRows = $('#libriTable tbody tr');
    allRows.hide();
    if (filter === 'Tutti') {
        allRows.show();
    } else {
        allRows.filter('[data-type="' + filter + '"]').show();
    }
}

function prendiInPrestito(idLibro) {
    const urlModuloPrestito = `https://docs.google.com/forms/d/e/1FAIpQLScUNgMUgKa_URu74Ju3G1HZXDMVlNMzX1D2egxB7Ut34wzIqg/viewform?entry.1518254211=${idLibro}`;
    window.open(urlModuloPrestito, '_blank');
}

function restituisciLibro(idLibro) {
    const urlModuloRestituzione = `https://docs.google.com/forms/d/e/1FAIpQLSfqR3bdauSlexTrCqcPnn05kjbOnE4utylDPUoIdRHqheSYCg/viewform?entry.300178690=${idLibro}`;
    window.open(urlModuloRestituzione, '_blank');
}



// Funzione per attivare la ricerca e scorrere alla tabella
$('#searchButton').on('click', function() {
    var value = $('#searchInput').val().toLowerCase(); // Prende il valore della barra di ricerca

    if (value.length > 0) { 
        $('#libriTable').show(); // Mostra la tabella dei risultati

        // Effettua lo scroll fino alla tabella, tenendo conto dell'altezza dell'header
        $('html, body').animate({
            scrollTop: $("#libriTable").offset().top - $('#header').height() - 20
        }, 600); // Velocità di scorrimento

        // Filtro dei risultati basato sul valore inserito
        $('#libriTable tbody tr').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    }
});
