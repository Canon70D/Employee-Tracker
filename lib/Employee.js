class Employee {
  constructor(first_name, lase_name, role_id, manager_id) {
    this.first_name = first_name;
    this.lase_name = lase_name;
    this.role_id = role_id;
    this.manager_id = manager_id;
  }

  getFirstName() {
    return this.first_name;
  }
  getLastName() {
    return this.lase_name;
  }
  getRoleId() {
    return this.role_id;
  }
  getManagerId() {
    return this.manager_id;
  }
}

module.exports = Employee;
