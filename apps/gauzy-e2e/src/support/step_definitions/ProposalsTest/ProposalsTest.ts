import * as loginPage from '../../Base/pages/Login.po';
import { LoginPageData } from '../../Base/pagedata/LoginPageData';
import * as faker from 'faker';
import * as proposalsPage from '../../Base/pages/Proposals.po';
import * as dashboardPage from '../../Base/pages/Dashboard.po';
import * as organizationTagsUserPage from '../../Base/pages/OrganizationTags.po';
import { OrganizationTagsPageData } from '../../Base/pagedata/OrganizationTagsPageData';
import { CustomCommands } from '../../commands';
import * as logoutPage from '../../Base/pages/Logout.po';
import * as manageEmployeesPage from '../../Base/pages/ManageEmployees.po';

import { Given, Then, When, And } from 'cypress-cucumber-preprocessor/steps';

const pageLoadTimeout = Cypress.config('pageLoadTimeout');

let jobPostUrl = faker.internet.url();
let editJobPostUrl = faker.internet.url();
let proposalContent = faker.lorem.paragraph();

let firstName = faker.name.firstName();
let lastName = faker.name.lastName();
let username = faker.internet.userName();
let password = faker.internet.password();
let employeeEmail = faker.internet.email();
let imgUrl = faker.image.avatar();

// Login with email
Given('Login with default credentials', () => {
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
});

// Add new tag
Then('User can add new tag', () => {
	CustomCommands.addTag(organizationTagsUserPage, OrganizationTagsPageData);
});

// Add new employee
And('User can add new employee', () => {
	CustomCommands.logout(dashboardPage, logoutPage, loginPage);
	CustomCommands.clearCookies();
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
	CustomCommands.addEmployee(
		manageEmployeesPage,
		firstName,
		lastName,
		username,
		employeeEmail,
		password,
		imgUrl
	);
});

// Add new proposal
And('User can visit Sales proposals page', () => {
	CustomCommands.logout(dashboardPage, logoutPage, loginPage);
	CustomCommands.clearCookies();
	CustomCommands.login(loginPage, LoginPageData, dashboardPage);
	cy.visit('/#/pages/sales/proposals', { timeout: pageLoadTimeout });
});

And('User can see grid button', () => {
	proposalsPage.gridBtnExists();
});

And('User can click on second grid button to change view', () => {
	proposalsPage.gridBtnClick(1);
});

And('User can see register proposal button', () => {
	proposalsPage.registerProposalButtonVisible();
});

When('User click on register proposal button', () => {
	proposalsPage.clickRegisterProposalButton();
});

And('User can see employee dropdown', () => {
	proposalsPage.selectEmployeeDropdownVisible();
});

When('User click on employee dropdown', () => {
	proposalsPage.clickEmployeeDropdown();
});

Then('User can select employee from dropdown options', () => {
	proposalsPage.selectEmployeeFromDrodpwon(1);
});

And('User can see job post input field', () => {
	proposalsPage.jobPostInputVisible();
});

And('User can enter job post url', () => {
	proposalsPage.enterJobPostInputData(jobPostUrl);
});

And('User can see date input field', () => {
	proposalsPage.dateInputVisible();
});

And('User can enter value for date', () => {
	proposalsPage.enterDateInputData();
});

And('User can see tags dropdown', () => {
	proposalsPage.tagsDropdownVisible();
});

When('User click on tags dropdown', () => {
	proposalsPage.clickTagsDropdwon();
});

Then('User can select tag from dropdown options', () => {
	proposalsPage.selectTagFromDropdown(0);
	proposalsPage.clickCardBody();
});

And('User can enter job proposal content', () => {
	proposalsPage.enterJobPostContentInputData(proposalContent);
});

And('User can see save button', () => {
	proposalsPage.saveProposalButtonVisible();
});

When('User click on save button', () => {
	proposalsPage.clickSaveProposalButton();
});

Then('Notification message will appear', () => {
	cy.on('uncaught:exception', (err, runnable) => {
		return false;
	});
	proposalsPage.waitMessageToHide();
});

// Edit proposal
And('User can see proposals table', () => {
	proposalsPage.tableRowVisible();
});

When('User click on proposals table row', () => {
	proposalsPage.selectTableRow(0);
});

Then('User can see details button', () => {
	proposalsPage.detailsButtonVisible();
});

When('User click on details button', () => {
	proposalsPage.clickDetailsButton(0);
});

Then('User can see edit proposal button', () => {
	proposalsPage.editProposalButtonVisible();
});

When('User click on edit proposal button', () => {
	proposalsPage.clickEditProposalButton();
});

Then('User can see job proposal input field again', () => {
	proposalsPage.jobPostInputVisible();
});

And('User can enter new job proposal url', () => {
	proposalsPage.enterJobPostInputData(editJobPostUrl);
});

And('User can see save edited proposal button', () => {
	proposalsPage.saveProposalButtonVisible();
});

When('User click on save edited proposal button', () => {
	proposalsPage.clickSaveProposalButton();
});

Then('Notification message will appear', () => {
	proposalsPage.waitMessageToHide();
});

// Mark proposal as Accepted
And('User can see proposals table again', () => {
	proposalsPage.tableRowVisible();
});

When('User click on proposals table row again', () => {
	proposalsPage.selectTableRow(0);
});

Then('User can see status button', () => {
	proposalsPage.markAsStatusButtonVisible();
});

When('User click on status button', () => {
	proposalsPage.clickMarkAsStatusButton();
});

Then('User can see confirm button', () => {
	proposalsPage.confrimStatusButtonVisible();
});

When('User click on confirm button', () => {
	proposalsPage.clickConfirmStatusButton();
});

Then('Notification message will appear', () => {
	proposalsPage.waitMessageToHide();
});

// Delete proposal
And('User can see again proposals table', () => {
	proposalsPage.tableRowVisible();
});

When('User click again on proposals table row', () => {
	proposalsPage.selectTableRow(0);
});

Then('User can see delete proposal button', () => {
	proposalsPage.deleteProposalButtonVisible();
});

When('User click on delete proposal button', () => {
	proposalsPage.clickDeleteProposalButton();
});

Then('User can see confirm delete button', () => {
	proposalsPage.confirmDeleteButtonVisible();
});

When('User click on confirm delete button', () => {
	proposalsPage.clickConfirmDeleteButton();
});

Then('Notification message will appear', () => {
	proposalsPage.waitMessageToHide();
});
