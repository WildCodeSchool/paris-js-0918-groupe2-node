const assert = require('assert'); 
const test = require('./dojoalgo');


it('runs', () => {
    return assert.deepEqual(true,true);
}); 

it('should works', async () =>  {

    const facture = {
        montant_ttc: 10268,
        echeance_facture: "12/09/2011"
    };

    const mesAcomptes = [
        (acompte1 = {
            montant_ttc: 100
        }),
        (acompte2 = {
            montant_ttc: 100
        })
    ];

    const mesAvoirs = [
        (avoir1 = {
            montant_ttc: 30
        }),
        (avoir2 = {
            montant_ttc: 38
        })
    ];

    test.getCalculInteretsTotal('01/01/2900', '31/12/3100').then(data => {
        return assert.deepEqual(data[0][0].nbre_jours_comptabilises, 140);
    });
    
});


