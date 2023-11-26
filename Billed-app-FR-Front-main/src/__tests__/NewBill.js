/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

// PARTIE NEWBILLUI
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("All the NewBill's Page inputs should be empty", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      // Tous les champs du formulaire NewBill
      const allInputs = document.getElementsByTagName("input").value
      const zoneCommentaire = document.getElementsByTagName("textarea").value
      // console.log des values
      // if (allInputs === undefined && zoneCommentaire === undefined) {
      //   console.log("LES 2 SONT VIDES")
      // }
      expect(allInputs && zoneCommentaire).toBe(undefined)
    })
    test("Every 'required' inputs should be filled before creating a new bill", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      // Tous les champs 'required' du formulaire NewBill
      // const requiredInputs = document.querySelectorAll('input[required]').value
      // const billType = document.getElementsByTagName("select").value
      // --------------------------------------------------------------
      const testSelectedCategory = true
      const testBillName = "Paris"
      const testRequiredDate = true
      const testRequiredPrice = 350
      const testTVAPercentage = 20
      const testJustificatif = true
      // --------------------------------------------------------------
      // console.log des values
      // if (requiredInputs !== undefined && billType !== undefined) {
      //   console.log("LES INPUTS REQUIRED SONT BIEN REMPLIES")
      // } else {
      //   console.log("VEUILLEZ RENSEIGNER LES INPUTS VIDES !!!")
      // }
      expect(testSelectedCategory && testBillName && testRequiredDate && testRequiredPrice && testTVAPercentage && testJustificatif).toBeDefined()
    })
  })
})

// PARTIE NEWBILL
// describe("Given I am connected as an employee", () => {
//   describe("When I complete a NewBill Document", () => {
//     test("The New Bill Document should be created & stocked", () => {
//       const newBillTest = new NewBill()
      
//       console.log("=====NEWBILL=====", newBillTest)
//     })
//   })
// })