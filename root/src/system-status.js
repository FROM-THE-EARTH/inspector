class SystemStatus{
  Type = {
    Green: 1,
    Red: 2
  };

  changeStatus(id, type) {
    id = '#' + id;

    if (type === this.Type.Red) {
      $(id).removeClass('systemstatus-green');
      $(id).addClass('systemstatus-red');
    }

    if (type === this.Type.Green) {
      $(id).removeClass('systemstatus-red');
      $(id).addClass('systemstatus-green');
    }
  }

}

module.exports = new SystemStatus();