var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes){
    const notice = sequelize.define("gospel_notices", {
			id: {
				type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
				primaryKey: true
			},
	    title: DataTypes.STRING,
      content: DataTypes.STRING,
      receiver: DataTypes.STRING,
      type: DataTypes.STRING,
      sender: DataTypes.STRING,
      teams: DataTypes.STRING,
      userType: { type: DataTypes.STRING, field: "user_type" },
      isDeleted: { type: DataTypes.INTEGER, field: "isdeleted", defaultValue: 0 }
	  },{
			timestamps: true,
      createdAt: 'createat',
      updatedAt: 'updateat',
      classMethods:{
          associate: (models) => {
                      console.log("associate");
                  },
          getAllInit: function(item) {

              if(item.read == null || item.read == undefined){
                return "SELECT * FROM gospel_notices a left join gospel_notice_read b on a.id = b.notice_id and a.isdeleted = 0  where receiver = :user and b.read is null"
              }
              return 'SELECT * FROM gospel_notices a left join gospel_notice_read b on a.id = b.notice_id and a.isdeleted = 0 WHERE receiver = :user and b.read = :read';
          },
          countInit: function(item) {

              if(item.read == null || item.read == undefined){
                  return 'SELECT count(a.id) as all FROM gospel_notices a left join gospel_notice_read b on a.id = b.notice_id and a.isdeleted = 0 WHERE receiver = :user and b.read is null';
              }
              return 'SELECT count(a.id) as all FROM gospel_notices a left join gospel_notice_read b on a.id = b.notice_id and a.isdeleted = 0 WHERE receiver = :user and b.read = :read';
          }

      }
    });
    return notice;
}
