export namespace tools {
	
	export class DiffLine {
	    type: string;
	    content: string;
	    oldLine: number;
	    newLine: number;
	
	    static createFrom(source: any = {}) {
	        return new DiffLine(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.content = source["content"];
	        this.oldLine = source["oldLine"];
	        this.newLine = source["newLine"];
	    }
	}
	export class DiffStats {
	    additions: number;
	    deletions: number;
	    changes: number;
	
	    static createFrom(source: any = {}) {
	        return new DiffStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.additions = source["additions"];
	        this.deletions = source["deletions"];
	        this.changes = source["changes"];
	    }
	}
	export class DiffResult {
	    lines: DiffLine[];
	    stats: DiffStats;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new DiffResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.lines = this.convertValues(source["lines"], DiffLine);
	        this.stats = this.convertValues(source["stats"], DiffStats);
	        this.error = source["error"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class JWTDecodeResult {
	    header: string;
	    payload: string;
	    signature: string;
	    isValid: boolean;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new JWTDecodeResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.header = source["header"];
	        this.payload = source["payload"];
	        this.signature = source["signature"];
	        this.isValid = source["isValid"];
	        this.error = source["error"];
	    }
	}
	export class RSADecryptResult {
	    plaintext: string;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new RSADecryptResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.plaintext = source["plaintext"];
	        this.error = source["error"];
	    }
	}
	export class RSAEncryptResult {
	    ciphertext: string;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new RSAEncryptResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ciphertext = source["ciphertext"];
	        this.error = source["error"];
	    }
	}
	export class RSAKeyPair {
	    publicKey: string;
	    privateKey: string;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new RSAKeyPair(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.publicKey = source["publicKey"];
	        this.privateKey = source["privateKey"];
	        this.error = source["error"];
	    }
	}

}

