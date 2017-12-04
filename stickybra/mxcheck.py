from validate_email import validate_email

email = "iam@stickeebra.com"

is_valid = validate_email(email,check_mx=True)

if is_valid:
    print email + " is Valid"
else:
    print email + " Not Valid"



# import DNS, smtplib, socket

# def checkmail(mail):
#     DNS.DiscoverNameServers()
#     print("checking %s...", mail)
#     hostname = mail[mail.find('@')+1:]
#     mx_hosts = DNS.mxlookup(hostname)
#     failed_mx = True
#     for mx in mx_hosts:
#         smtp = smtplib.SMTP()
#         try:
#             smtp.connect(mx[1])
#             print("Stage 1 (MX lookup & connect) successful.")
#             failed_mx = False
#             s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#             s.connect((mx[1], 25))
#             s.recv(1024)
#             s.send("HELO %s\n"%(mx[1]))
#             s.recv(1024)
#             s.send("MAIL FROM:< test@test.com>\n")
#             s.recv(1024)
#             s.send("RCPT TO:<%s>\n"%(mail))
#             result = s.recv(1024)
#             print(result)
#             if result.find('Recipient address rejected') > 0:
#                 print("Failed at stage 2 (recipient does not exist)")
#             else:
#                 print("Adress valid.")
#                 failed_mx = False
#             s.send("QUIT\n")
#             break
#         except smtplib.SMTPConnectError:
#             continue
#     if failed_mx:
#         print("Failed at stage 1 (MX lookup & connect).")
#     print("")
#     if not failed_mx:
#         return True
#     return False

# checkmail('iam@stickeebra.com')