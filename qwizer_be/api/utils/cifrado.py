from Crypto.Cipher import AES
import binascii
#-------------------------------------------------------------------------------------------------------------------------------------------------------------------------


def _pad_string(in_string):
    '''Pad an input string according to PKCS#7'''
    in_len = len(in_string)
    pad_size = 16 - (in_len % 16)
    return in_string.ljust(in_len + pad_size, chr(pad_size))


def decrypt(message, in_iv, in_key):
		'''
		Return encrypted string.
		@in_encrypted: Base64 encoded 
		@key: hexified key
		@iv: hexified iv
		'''
		key = binascii.a2b_hex(in_key)
		iv = binascii.a2b_hex(in_iv)
		aes = AES.new(key, AES.MODE_CFB, iv, segment_size=128)		
		
		decrypted = aes.decrypt(binascii.a2b_base64(message).rstrip())
		return _unpad_string(decrypted)

def _unpad_string(in_string):
		'''Remove the PKCS#7 padding from a text string'''
		in_len = len(in_string)
		pad_size = ord(in_string[-1])
		if pad_size > 16:
			raise ValueError('Input is not padded or padding is corrupt')
		return in_string[:in_len - pad_size]