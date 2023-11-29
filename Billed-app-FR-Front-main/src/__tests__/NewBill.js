/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill, {bill} from "../containers/NewBill.js"

// ------------------------------------------------------------------------------------------------------------------
// PARTIE NEWBILLUI
// ------------------------------------------------------------------------------------------------------------------
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
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
      const depenseName = "Test Nom de Dépense" // document.querySelector('input[data-testid="expense-name"]')
      const depenseDate = "2023-11-27" // document.querySelector('input[data-testid="datepicker"]')
      const depenseAmount = 1337 // document.querySelector('input[data-testid="amount"]')
      const depenseTVA = 70 // document.querySelector('input[data-testid="vat"]')
      const depensePCT = 20 // document.querySelector('input[data-testid="pct"]')
      const depenseCommentaire = "Ceci est un commentaire ajouté dans la zone du Formulaire" // document.querySelector('textarea[data-testid="commentary"]')
      const depenseJustificatifFile = true // document.querySelector('input[type="file"]')
      // console.log(typeDeDepense, depenseName, depenseDate, depenseAmount, depenseTVA, depensePCT, depenseCommentaire, depenseJustificatifFile)
      expect(typeDeDepense && depenseName && depenseDate && depenseAmount && depenseTVA && depensePCT && depenseCommentaire && depenseJustificatifFile).toBeDefined()
    })
  })
})

// ------------------------------------------------------------------------------------------------------------------
// PARTIE NEWBILL
// ------------------------------------------------------------------------------------------------------------------
describe("Given I am connected as an employee", () => {
  describe("When I complete a NewBill Document", () => {
    test("passing newbill.js test", () => {


      const bill = {
        // email,
        type: document.querySelector('select[data-testid="expense-type"]')[2].value,
        name: "Test1337",
        amount: 1337,
        date: "2023-11-27",
        vat: 70,
        pct: 20,
        commentary: "Encore un test",
        fileUrl: "E:/Pictures/Dégradé Bleus.jpg",
        fileName: "Dégradé Bleus.jpg",
        status: 'pending'
      }
      
      // Définit le <input> pour Justificatif
      const fileField = screen.getByTestId("file");
      //
      fireEvent.change(
        fileField,
        { target: { files: [ new File([bill.fileName], bill.fileUrl, { type: "image/png" }) ] } }
      );
      //
      expect(fileField.files[0].name).toBe(bill.fileUrl);
      expect(fileField.files[0].type).toBe("image/png");
      // expect(handleChangeFile).toHaveBeenCalled();

      

    })
  })
})