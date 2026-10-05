export enum MemberType {
	USER = 'USER',
	SELLER = 'SELLER',
	ADMIN = 'ADMIN',
}

export enum MemberStatus {
	ACTIVE = 'ACTIVE',
	BLOCK = 'BLOCK',
	DELETE = 'DELETE',
}

export enum MemberAuthType {
	LOCAL = 'LOCAL',
	GOOGLE = 'GOOGLE',
	KAKAO = 'KAKAO',
}

export enum MemberLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	DAEJEON = 'DAEJEON',
	GWANGJU = 'GWANGJU',
	ULSAN = 'ULSAN',
	SEJONG = 'SEJONG',
	SUWON = 'SUWON',
	JEJU = 'JEJU',
}

export enum MemberSellerStatus {
	NONE = 'NONE',
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED',
}
