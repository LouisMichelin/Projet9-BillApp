/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

// Initialisation
jest.mock("../app/Store", () => mockStore);
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");
      expect(mailIcon).toBeTruthy();
    });
  });
})

describe("Given I am connected as an employee", () => {
  // PARTIE NEWBILLUI.js
  describe("When I am on a NewBill Page", () => {
    
    test("All the NewBill's Page inputs should be empty", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      // Tous les champs du formulaire NewBill
      const allInputs = document.getElementsByTagName("input").value
      const zoneCommentaire = document.getElementsByTagName("textarea").value
      expect(allInputs && zoneCommentaire).toBe(undefined)
    })

    test("Every 'required' inputs should be filled before creating a new bill", () => {
      // Initialisation du formulaire :
      const html = NewBillUI()
      document.body.innerHTML = html
      // Tous les champs 'required' du formulaire NewBill :
      const typeDeDepense = document.querySelector('select[data-testid="expense-type"]')[2].value
      const depenseName = "Test Nom de Dépense"
      const depenseDate = "2023-11-27"
      const depenseAmount = 1337
      const depenseTVA = 70
      const depensePCT = 20
      const depenseCommentaire = "Ceci est un commentaire ajouté dans la zone du Formulaire"
      const depenseJustificatifFile = true
      expect(typeDeDepense && depenseName && depenseDate && depenseAmount && depenseTVA && depensePCT && depenseCommentaire && depenseJustificatifFile).toBeDefined()
    })
  })
  // PARTIE NEWBILL.js
  describe("When I complete a NewBill Page", () => {
    test("When I submit all the data", async () => {
      // Initialisation
      const html = NewBillUI()
      document.body.innerHTML = html
      const bill = {
        email: "employee@test.tld",
        type: "Transports",
        name: "TGV",
        amount: 1337,
        date: "2023-12-04",
        vat: "70",
        pct: 20,
        commentary: "Facture Test",
        fileUrl: "testFacture.png",
        fileName: "testFacture",
        status: 'pending'
      };
      const formulaireType = screen.getByTestId("expense-type");
      fireEvent.change(formulaireType, { target: { value: bill.type } });
      expect(formulaireType.value).toBe(bill.type);
      const formulaireNom = screen.getByTestId("expense-name");
      fireEvent.change(formulaireNom, { target: { value: bill.name } });
      expect(formulaireNom.value).toBe(bill.name);
      const formulaireDate = screen.getByTestId("datepicker");
      fireEvent.change(formulaireDate, { target: { value: bill.date } });
      expect(formulaireDate.value).toBe(bill.date);
      const formulairePrix = screen.getByTestId("amount");
      fireEvent.change(formulairePrix, { target: { value: bill.amount } });
      expect(parseInt(formulairePrix.value)).toBe(parseInt(bill.amount));
      const formulaireTVA = screen.getByTestId("vat");
      fireEvent.change(formulaireTVA, { target: { value: bill.vat } });
      expect(parseInt(formulaireTVA.value)).toBe(parseInt(bill.vat));
      const formulairePCT = screen.getByTestId("pct");
      fireEvent.change(formulairePCT, { target: { value: bill.pct } });
      expect(parseInt(formulairePCT.value)).toBe(parseInt(bill.pct));
      const formulaireCommentaire = screen.getByTestId("commentary");
      fireEvent.change(formulaireCommentaire, { target: { value: bill.commentary } });
      expect(formulaireCommentaire.value).toBe(bill.commentary);
      ////////////////////////////////////////////////////////
      const newBillForm = screen.getByTestId("form-new-bill");
      const onNavigate = pathname => { document.body.innerHTML = ROUTES({ pathname }); };
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      newBillForm.addEventListener("change", handleChangeFile);
      // Justificatif
      const formulaireJustificatif = screen.getByTestId("file");
      fireEvent.change(formulaireJustificatif, { target: { files: [ new File([bill.fileName], bill.fileUrl, { type: "image/png" }) ] } });
      expect(formulaireJustificatif.files[0].name).toBe(bill.fileUrl);
      expect(formulaireJustificatif.files[0].type).toBe("image/png");
      expect(handleChangeFile).toHaveBeenCalled();
      ///////////////////////////////////////////////////
      const handleSubmit = jest.fn(newBill.handleSubmit);
      newBillForm.addEventListener("submit", handleSubmit);
      fireEvent.submit(newBillForm);
      expect(handleSubmit).toHaveBeenCalled();
    })
  })
})

// -------------------
// | TESTS 404 & 500 |
// -------------------
describe("Given I am connected as an employee", () => {
  // -----------------------------------------------------------------------------------------------------------------------------------------
  // | ERREUR 404 - MOCK RECUPERATION API ; ECHEC AVEC ERROR 404
  // -----------------------------------------------------------------------------------------------------------------------------------------
  describe("WHEN I SIMULATE ERROR 404", () => {
    test('It fetches error from an API and fails with error 404', async () => {
      // IMPLEMENTATIONS MOCK
      jest.spyOn(mockStore, 'bills')
      jest.spyOn(console, 'error').mockImplementation(() => {}) // Empêche un "console.error" de jest
      // DEFINITION DES 2 PROPRIETES :
      Object.defineProperty(window, 'localStorage', { value: localStorageMock }) // Propriété #1 : WINDOW LOCALSTORAGE
      Object.defineProperty(window, 'location', { value: { hash: ROUTES_PATH['NewBill'] } }) // Propriété #2 : WINDOW LOCATION
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' })) // Assimiliation d'un ITEM, "USER", au WINDOW LOCALSTORAGE
      document.body.innerHTML = `<div id="root"></div>`
      router() // Exécution de ROUTER() pour le chemin spécifié dans WINDOW LOCATION
      // CREATION DE onNavigate (reprend PATHNAME avec la fonction ROUTES() )
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname }) 
      }
      // PREPARATION DE l'OBJET MOCKED qui va simuler ('mocker' 1 fois) l'erreur 404
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update : () =>  {
            return Promise.reject(new Error('Erreur 404')) 
          }
        }
      })
		  // CREATION D'UNE NEWBILL
      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
      // SOUMISSION DU FORMULAIRE
      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e)) // INVOCATION de newBill.handleSubmit() GRÂCE à JEST.FN()
      form.addEventListener('submit', handleSubmit) // "SUBMIT" LISTENER
      // ENVOI DU FORMULAIRE
      fireEvent.submit(form)
      // ATTENTE DE L'ERREUR 404
      await new Promise(process.nextTick) // AWAIT le process "new Promise()" qui retourne l'erreur 404
      expect(console.error).toBeCalled() // EXPECT erreur 404
    })
  })

  // -----------------------------------------------------------------------------------------------------------------------------------------
  // | ERREUR 500 - MOCK RECUPERATION API ; ECHEC AVEC ERROR 500
  // -----------------------------------------------------------------------------------------------------------------------------------------
  describe("WHEN I SIMULATE ERROR 500", () => {
    test('It fetches error from an API and fails with error 500', async () => {
      // IMPLEMENTATIONS MOCK
      jest.spyOn(mockStore, 'bills')
      jest.spyOn(console, 'error').mockImplementation(() => {}) // Empêche un "console.error" de jest
      // DEFINITION DES 2 PROPRIETES :
      Object.defineProperty(window, 'localStorage', { value: localStorageMock }) // Propriété #1 : WINDOW LOCALSTORAGE
      Object.defineProperty(window, 'location', { value: { hash: ROUTES_PATH['NewBill'] } }) // Propriété #2 : WINDOW LOCATION
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' })) // Assimiliation d'un ITEM, "USER", au WINDOW LOCALSTORAGE
      document.body.innerHTML = `<div id="root"></div>`
      router() // Exécution de ROUTER() pour le chemin spécifié dans WINDOW LOCATION
      // CREATION DE onNavigate (reprend PATHNAME avec la fonction ROUTES() )
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname }) 
      }
      // PREPARATION DE l'OBJET MOCKED qui va simuler ('mocker' 1 fois) l'erreur 500
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update : () =>  {
            return Promise.reject(new Error('Erreur 500')) 
          }
        }
      })
		  // CREATION D'UNE NEWBILL
      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
      // SOUMISSION DU FORMULAIRE
      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e)) // INVOCATION de newBill.handleSubmit() GRÂCE à JEST.FN()
      form.addEventListener('submit', handleSubmit) // "SUBMIT" LISTENER
      // ENVOI DU FORMULAIRE
      fireEvent.submit(form)
      // ATTENTE DE L'ERREUR 500
      await new Promise(process.nextTick) // AWAIT le process "new Promise()" qui retourne l'erreur 500
      expect(console.error).toBeCalled() // EXPECT erreur 500
    })
  })

});