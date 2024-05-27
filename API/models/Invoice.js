const { Model, DataTypes, Sequelize } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
    }
  }
  Invoice.init({
    idt_invoice: { type: DataTypes.UUID, primaryKey: true, autoIncrement: true},
    ref_month: { type: DataTypes.STRING, allowNull: false },
    client_number: { type: DataTypes.STRING, allowNull: false },
    energy_cost: { type: DataTypes.INTEGER, allowNull: true },
    energy_quantity: { type: DataTypes.INTEGER, allowNull: true },
    scee_cost: { type: DataTypes.INTEGER, allowNull: true },
    scee_quantity: { type: DataTypes.INTEGER, allowNull: true },
    energy_comp_cost: { type: DataTypes.INTEGER, allowNull: true },
    energy_comp_quantity: { type: DataTypes.INTEGER, allowNull: true },
    contribution: { type: DataTypes.INTEGER, allowNull: true },
    b64_file: { type: DataTypes.STRING, allowNull: true },
  }, {
    sequelize,
    modelName: 'invoice',
    freezeTableName: true,
    timestamps: false
  });
  return Invoice;
}
