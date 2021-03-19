export const convertDate = (datetime) => {   // post tarihini türkçe tarihe çeviriyorum
    const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

    // ÖRN : 2021-01-01T15:22:11

    const date = datetime.split('T')[0].split('-');
    const tr_date = date[2] + ' ' + months[Number(date[1])-1] + ' ' + date[0];
    const time = datetime.split('T')[1].substr(0,5);

    return tr_date + ' - ' + time;
}